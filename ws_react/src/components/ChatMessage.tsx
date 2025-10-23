import type { ChatMessage as ChatMessageType } from '../../types/chat';

interface ChatMessageProps {
    message: ChatMessageType & { isLLM?: boolean; provider?: string };
    isOwnMessage: boolean;
}

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    // Verificar se é uma mensagem da LLM de forma mais robusta
    const isLLMMessage = message.isLLM || message.user_id === 'llm' || (message as any).id?.startsWith('llm-');

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isOwnMessage && !isLLMMessage && (
                    <span className="text-xs text-[#A0A0A0] mb-1.5 px-1">
                        {message.chat_users?.display_name || 'Usuário'}
                    </span>
                )}
                {isLLMMessage && (
                    <span className="text-xs text-[#A0A0A0] mb-1.5 px-1">
                        Assistente LLM{message.provider ? ` (${message.provider})` : ''}
                    </span>
                )}
                <div
                    className={`rounded-2xl px-4 py-3 ${isOwnMessage
                            ? 'bg-white/[0.05] backdrop-blur-3xl border border-white/[0.3] text-[#E0E0E0] rounded-br-md'
                            : isLLMMessage
                                ? 'bg-transparent backdrop-blur-3xl border text-[#E0E0E0] rounded-bl-md'
                                : 'bg-transparent border text-[#E0E0E0] rounded-bl-md'
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