import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
    type: string;
    [key: string]: unknown;
}

interface UseWebSocketOptions {
    url: string;
    onMessage?: (message: WebSocketMessage) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}

export function useWebSocket({
    url,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
}: UseWebSocketOptions) {
    const [isConnected, setIsConnected] = useState(false);
    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const shouldReconnectRef = useRef(true);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                console.log('[WebSocket] Connected');
                setIsConnected(true);
                setReconnectAttempt(0);
                onOpen?.();
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    onMessage?.(message);
                } catch (error) {
                    console.error('[WebSocket] Failed to parse message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('[WebSocket] Error:', error);
                onError?.(error);
            };

            ws.onclose = () => {
                console.log('[WebSocket] Disconnected');
                setIsConnected(false);
                wsRef.current = null;
                onClose?.();

                if (shouldReconnectRef.current && reconnectAttempt < maxReconnectAttempts) {
                    reconnectTimeoutRef.current = window.setTimeout(() => {
                        console.log(`[WebSocket] Reconnecting... (attempt ${reconnectAttempt + 1}/${maxReconnectAttempts})`);
                        setReconnectAttempt(prev => prev + 1);
                        connect();
                    }, reconnectInterval);
                }
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('[WebSocket] Connection failed:', error);
        }
    }, [url, onMessage, onOpen, onClose, onError, reconnectAttempt, reconnectInterval, maxReconnectAttempts]);

    const disconnect = useCallback(() => {
        shouldReconnectRef.current = false;
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
    }, []);

    const sendMessage = useCallback((message: unknown) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.warn('[WebSocket] Cannot send message: not connected');
        }
    }, []);

    useEffect(() => {
        connect();

        return () => {
            shouldReconnectRef.current = false;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connect]);

    return {
        isConnected,
        sendMessage,
        disconnect,
        reconnect: connect,
        reconnectAttempt,
    };
}
