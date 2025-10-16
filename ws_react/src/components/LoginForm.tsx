import { useState } from 'react';
import { User } from 'lucide-react';

interface LoginFormProps {
    onLogin: (username: string, displayName: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && displayName.trim()) {
            onLogin(username.trim(), displayName.trim());
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
            <div className="bg-[#1A1A1A] rounded-2xl p-8 w-full max-w-md border border-[#2A2A2A]">
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-background p-4 rounded-full">
                        <User className="w-8 h-8 text-[#222222]" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-[#E0E0E0] text-center mb-2">
                    Entrar no Chat
                </h1>
                <p className="text-[#A0A0A0] text-center mb-8">
                    Digite suas informações para começar
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-base font-medium text-[#E0E0E0] mb-2">
                            Nome de usuário
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#E0E0E0] placeholder-[#A0A0A0]"
                            placeholder="usuario123"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="displayName" className="block text-base font-medium text-[#E0E0E0] mb-2">
                            Nome de exibição
                        </label>
                        <input
                            type="text"
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-3 bg-[#121212] border border-[#2A2A2A] rounded-lg text-[#E0E0E0] placeholder-[#A0A0A0]"
                            placeholder="Seu Nome para Exibição no Chat"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-background text-[#222222] font-semibold py-3 rounded-full"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
