export interface ChatUser {
    id: string;
    username: string;
    display_name: string;
    is_online: boolean;
    last_seen: string;
    created_at: string;
}

export interface ChatMessage {
    id: string;
    user_id: string;
    message: string;
    created_at: string;
    chat_users?: ChatUser;
    // Campos adicionais para mensagens LLM
    isLLM?: boolean;
    provider?: string;
    isError?: boolean;
}

export interface ChatSession {
    id: string;
    user_id: string;
    session_token: string;
    connected_at: string;
    last_activity: string;
}