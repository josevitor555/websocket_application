import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    onTyping: () => void;
    disabled?: boolean;
}

export function ChatInput({ onSendMessage, onTyping, disabled }: ChatInputProps) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        onTyping();
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <input
                type="text"
                value={message}
                onChange={handleChange}
                disabled={disabled}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-3 bg-[#121212] border border-[#2A2A2A] rounded-xl text-[#E0E0E0] placeholder-[#A0A0A0]"
            />
            <button
                type="submit"
                disabled={!message.trim() || disabled}
                className="bg-background text-[#121212] p-3 rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
    );
}
