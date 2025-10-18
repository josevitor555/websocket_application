import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
    isConnected: boolean;
    reconnectAttempt: number;
    onReconnect: () => void;
}

export function ConnectionStatus({ isConnected, reconnectAttempt, onReconnect }: ConnectionStatusProps) {
    if (isConnected) {
        return (
            <div className="flex items-center gap-2 text-[#22C55E] text-sm">
                <Wifi className="w-4 h-4" />
                <span>Conectado</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-background text-sm">
                <WifiOff className="w-4 h-4" />
                <span>
                    {reconnectAttempt > 0 ? `Reconectando... (${reconnectAttempt})` : 'Desconectado'}
                </span>
            </div>
            <button
                onClick={onReconnect}
                className="text-background hover:text-background transition-colors p-1 rounded"
                title="Reconectar"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
        </div>
    );
}
