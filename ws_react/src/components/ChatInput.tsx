import { useState, useRef, useEffect } from 'react';
import { LLMMentionModal } from './LLMMentionModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    onTyping: () => void;
    disabled?: boolean;
}

export function ChatInput({ onSendMessage, onTyping, disabled }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [showLLMModal, setShowLLMModal] = useState(false);
    const [mentionPosition, setMentionPosition] = useState({ x: 0, y: 0 });
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMessage(value);
        onTyping();

        // Verificar se o usuário digitou "@" no final do texto ou após um espaço
        if (value.endsWith('@') || (value.length > 1 && value.endsWith('@') && value.charAt(value.length - 2) === ' ')) {
            // Centralizar o modal na tela em vez de posicionar próximo ao input
            setMentionPosition({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            });
            
            setShowLLMModal(true);
        }
    };

    const handleLLMSelect = (llmId: string) => {
        // Substituir o "@" pelo nome do LLM selecionado
        const updatedMessage = message.replace(/@\s*$/, `@${llmId} `);
        setMessage(updatedMessage);
        
        // Focar novamente no input
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    // Fechar o modal quando o componente desmontar ou quando o usuário clicar fora
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (showLLMModal && !(e.target as Element).closest('.llm-modal')) {
                setShowLLMModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLLMModal]);

    return (
        <>
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="Digite sua mensagem... (use @ para mencionar um LLM)"
                    className="flex-1 px-4 py-3 bg-transparent border border-[#2A2A2A] rounded-xl text-[#E0E0E0] placeholder-[#A0A0A0]"
                />
                <button
                    type="submit"
                    disabled={!message.trim() || disabled}
                    className="bg-background text-[#121212] p-3 rounded-xl transition-colors duration-200 disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
                </button>
            </form>

            {showLLMModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <LLMMentionModal
                        onClose={() => setShowLLMModal(false)}
                        onSelect={handleLLMSelect}
                    />
                </div>
            )}
        </>
    );
}