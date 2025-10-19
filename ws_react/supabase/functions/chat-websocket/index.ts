// Type definitions for Deno runtime
interface DenoNamespace {
  serve(handler: (req: Request) => Promise<Response>): void;
  upgradeWebSocket(request: Request): { socket: WebSocket; response: Response };
  env: {
    get(key: string): string | undefined;
  };
}

declare const Deno: DenoNamespace;

import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ConnectionManager {
    clients: Map<string, WebSocket>;
    userSessions: Map<string, string>;
}

const connections: ConnectionManager = {
    clients: new Map(),
    userSessions: new Map(),
};

Deno.serve(async (req: Request) => {
    try {
        if (req.method === 'OPTIONS') {
            return new Response(null, {
                status: 200,
                headers: corsHeaders,
            });
        }

        const upgrade = req.headers.get('upgrade') || '';

        if (upgrade.toLowerCase() !== 'websocket') {
            return new Response(
                JSON.stringify({ error: 'Expected WebSocket connection' }),
                {
                    status: 426,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        const url = new URL(req.url);
        const sessionToken = url.searchParams.get('session');
        const userId = url.searchParams.get('userId');

        if (!sessionToken || !userId) {
            return new Response(
                JSON.stringify({ error: 'Session token and userId required' }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Validate Supabase client
        if (!Deno.env.get('SUPABASE_URL') || !Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
            console.error('[ERROR] Missing Supabase environment variables');
            return new Response(
                JSON.stringify({ error: 'Server configuration error' }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        socket.onopen = async () => {
            console.log(`[CONNECT] User ${userId} connected with session ${sessionToken}`);

            connections.clients.set(sessionToken, socket);
            connections.userSessions.set(userId, sessionToken);

            try {
                await supabase
                    .from('chat_users')
                    .update({ is_online: true, last_seen: new Date().toISOString() })
                    .eq('id', userId);

                await supabase
                    .from('chat_sessions')
                    .upsert({
                        session_token: sessionToken,
                        user_id: userId,
                        last_activity: new Date().toISOString(),
                    });

                const { data: user } = await supabase
                    .from('chat_users')
                    .select('*')
                    .eq('id', userId)
                    .maybeSingle();

                broadcastToAll(
                    JSON.stringify({
                        type: 'user_joined',
                        user,
                        timestamp: new Date().toISOString(),
                    }),
                    sessionToken
                );

                socket.send(
                    JSON.stringify({
                        type: 'connected',
                        sessionToken,
                        userId,
                        timestamp: new Date().toISOString(),
                    })
                );
            } catch (error) {
                console.error(`[ERROR] Failed to initialize connection for user ${userId}:`, error);
                socket.close(1011, 'Failed to initialize connection');
            }
        };

        socket.onmessage = async (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                console.log(`[MESSAGE] Received from ${userId}:`, data);

                // Update last activity
                await supabase
                    .from('chat_sessions')
                    .update({ last_activity: new Date().toISOString() })
                    .eq('session_token', sessionToken);

                if (data.type === 'message') {
                    const { data: message, error: insertError } = await supabase
                        .from('chat_messages')
                        .insert({
                            user_id: userId,
                            message: data.message,
                        })
                        .select('*, chat_users(*)')
                        .single();

                    if (insertError) {
                        console.error('[ERROR] Failed to insert message:', insertError);
                        socket.send(
                            JSON.stringify({
                                type: 'error',
                                message: 'Failed to send message',
                                timestamp: new Date().toISOString(),
                            })
                        );
                        return;
                    }

                    broadcastToAll(
                        JSON.stringify({
                            type: 'new_message',
                            message,
                            timestamp: new Date().toISOString(),
                        })
                    );
                } else if (data.type === 'typing') {
                    broadcastToAll(
                        JSON.stringify({
                            type: 'user_typing',
                            userId,
                            username: data.username,
                            timestamp: new Date().toISOString(),
                        }),
                        sessionToken
                    );
                }
            } catch (error) {
                console.error('[ERROR] Processing message:', error);
                socket.send(
                    JSON.stringify({
                        type: 'error',
                        message: 'Failed to process message',
                        timestamp: new Date().toISOString(),
                    })
                );
            }
        };

        socket.onerror = (error: Event) => {
            console.error(`[ERROR] WebSocket error for ${userId}:`, error);
        };

        socket.onclose = async () => {
            console.log(`[DISCONNECT] User ${userId} disconnected`);

            connections.clients.delete(sessionToken);
            connections.userSessions.delete(userId);

            try {
                await supabase
                    .from('chat_users')
                    .update({ is_online: false, last_seen: new Date().toISOString() })
                    .eq('id', userId);

                await supabase
                    .from('chat_sessions')
                    .delete()
                    .eq('session_token', sessionToken);

                const { data: user } = await supabase
                    .from('chat_users')
                    .select('*')
                    .eq('id', userId)
                    .maybeSingle();

                broadcastToAll(
                    JSON.stringify({
                        type: 'user_left',
                        user,
                        timestamp: new Date().toISOString(),
                    })
                );
            } catch (error) {
                console.error(`[ERROR] Failed to clean up connection for user ${userId}:`, error);
            }
        };

        return response;
    } catch (error) {
        console.error('[ERROR] WebSocket handler:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                },
            }
        );
    }
});

function broadcastToAll(message: string, excludeSession?: string) {
    connections.clients.forEach((client, session) => {
        // Using numeric values instead of WebSocket constants to avoid TypeScript errors in Deno environment
        if (session !== excludeSession && (client.readyState as number) === 1) { // WebSocket.OPEN = 1
            try {
                client.send(message);
            } catch (error) {
                console.error(`[ERROR] Broadcasting to ${session}:`, error);
                // Remove dead connections
                // Check all possible readyState values explicitly
                const readyState = client.readyState as number;
                if (readyState === 3 || readyState === 2) { // WebSocket.CLOSED = 3, WebSocket.CLOSING = 2
                    connections.clients.delete(session);
                    // Try to find and remove the corresponding user session
                    connections.userSessions.forEach((sessToken, userId) => {
                        if (sessToken === session) {
                            connections.userSessions.delete(userId);
                        }
                    });
                }
            }
        }
    });
}