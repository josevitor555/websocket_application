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

    // Determinar o alinhamento com base no tipo de mensagem
    const isUserMessage = isOwnMessage && !isLLMMessage;

    // Função para formatar o texto da mensagem com quebras de parágrafo
    const formatMessageText = (text: string) => {
        // Para mensagens da IA, aplicar formatação mais rica
        if (isLLMMessage) {
            // Dividir o texto em parágrafos usando quebras de linha duplas
            const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
            
            // Se não houver quebras de linha duplas significativas, usar uma abordagem alternativa
            if (paragraphs.length <= 1 || paragraphs.every(p => p.length < 50)) {
                // Dividir em sentenças usando pontos, exclamações e interrogações como delimitadores
                const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim() !== '');
                
                // Agrupar sentenças em parágrafos de 3 a 5 sentenças
                const groupedParagraphs = [];
                for (let i = 0; i < sentences.length; i += 4) {
                    const group = sentences.slice(i, i + 4);
                    if (group.length > 0) {
                        groupedParagraphs.push(group.join(' '));
                    }
                }
                
                return groupedParagraphs.map((paragraph, index) => {
                    return (
                        <p 
                            key={index} 
                            className="mb-3 last:mb-0"
                        >
                            {paragraph}
                        </p>
                    );
                });
            }
            
            return paragraphs.map((paragraph, index) => {
                // Verificar se o parágrafo contém listas ou itens que precisam de indentação
                const lines = paragraph.split('\n');
                const hasListItems = lines.some(line => line.match(/^[\d\-\*\+]\s/));
                
                if (hasListItems) {
                    return (
                        <div 
                            key={index} 
                            className="mb-3 last:mb-0"
                        >
                            {lines.map((line, lineIndex) => {
                                // Verificar se a linha é um item de lista
                                if (line.match(/^[\d\-\*\+]\s/)) {
                                    return (
                                        <div key={lineIndex} className="flex items-start ml-4 mb-1">
                                            <span className="mr-2">•</span>
                                            <span>{line.substring(2)}</span>
                                        </div>
                                    );
                                }
                                // Linhas normais de texto
                                return (
                                    <div key={lineIndex} className="mb-1">
                                        {line}
                                    </div>
                                );
                            })}
                        </div>
                    );
                }
                
                // Substituir quebras de linha simples por <br> para manter a formatação
                const formattedLines = lines.map((line, lineIndex) => (
                    <>
                        {line}
                        {lineIndex < lines.length - 1 && <br />}
                    </>
                ));
                
                return (
                    <p 
                        key={index} 
                        className="mb-3 last:mb-0"
                    >
                        {formattedLines}
                    </p>
                );
            });
        }
        
        // Para mensagens de usuários, manter a formatação simples
        return <p className="text-base break-words">{text}</p>;
    };

    return (
        <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isUserMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isUserMessage && (
                    <span className="text-xs text-[#A0A0A0] mb-1.5 px-1">
                        {isLLMMessage 
                          ? `Assistente LLM${message.provider ? ` (${message.provider})` : ''}`
                          : (message.chat_users?.display_name || 'Usuário')}
                    </span>
                )}
                <div
                    className={`rounded-2xl px-4 py-3 ${isUserMessage
                            ? 'bg-white/[0.05] backdrop-blur-3xl border border-white/[0.3] text-[#E0E0E0] rounded-br-md'
                            : isLLMMessage
                                ? 'bg-transparent backdrop-blur-3xl border text-[#E0E0E0] rounded-bl-md'
                                : 'bg-transparent border text-[#E0E0E0] rounded-bl-md'
                        }`}
                >
                    <div className="text-base break-words">
                        {formatMessageText(message.message)}
                    </div>
                </div>
                <span className="text-xs text-[#A0A0A0] mt-1 px-1">
                    {formatTime(message.created_at)}
                </span>
            </div>
        </div>
    );
}