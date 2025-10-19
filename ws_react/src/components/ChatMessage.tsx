import type { ChatMessage as ChatMessageType } from '../../types/chat';

interface ChatMessageProps {
    message: ChatMessageType;
    isOwnMessage: boolean;
}

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isOwnMessage && (
                    <span className="text-xs text-[#A0A0A0] mb-1.5 px-1">
                        {message.chat_users?.display_name || 'Usuário'}
                    </span>
                )}
                <div
                    className={`rounded-2xl px-4 py-3 ${isOwnMessage
                            ? 'bg-[#E0E0E0] text-[#1A1A1A] rounded-br-md'
                            : 'bg-[#1A1A1A] text-[#E0E0E0] rounded-bl-md'
                        }`}
                >
                    <p className="text-base break-words">{message.message}</p>
                </div>
                <span className="text-xs text-[#A0A0A0] mt-1 px-1">
                    {formatTime(message.created_at)}
                </span>
            </div>
        </div>
    );
}
