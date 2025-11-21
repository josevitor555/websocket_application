import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { motion, easeOut } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Spline from '@splinetool/react-spline';

export function LoginForm() {
    const { login, loading, error } = useAuth();
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    // const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!username.trim() || !displayName.trim()) {
            return;
        }

        try {
            await login(username.trim(), displayName.trim());
            // O redirecionamento agora é feito no hook useAuth
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    // Animation variants for slide-in from left effect
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            x: -30
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: easeOut
            }
        }
    };

    // Fade-in animation variants for Spline and form container
    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 1,
                ease: easeOut
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f10] flex items-center justify-center px-4">
            <motion.div
                className="absolute inset-0 z-0"
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
            >
                <Spline
                    scene="https://prod.spline.design/Cfb4o-fpeVAWH4Px/scene.splinecode"
                />
            </motion.div>
            <motion.div 
                className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 w-full max-w-md border border-white/10 relative z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div 
                    className="flex items-center justify-center mb-6"
                    variants={itemVariants}
                >
                    <div className="bg-background p-4 rounded-full">
                        <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-[#E0E0E0]" />
                    </div>
                </motion.div>

                <motion.h1 
                    className="text-2xl font-bold text-[#E0E0E0] text-center mb-2"
                    variants={itemVariants}
                >
                    IAArena
                </motion.h1>
                
                <motion.p 
                    className="text-[#A0A0A0] text-center mb-8"
                    variants={itemVariants}
                >
                   Entre com as informações abaixo
                </motion.p>

                {error && (
                    <motion.div 
                        className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm"
                        variants={itemVariants}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div variants={itemVariants}>
                        <label htmlFor="username" className="block text-base font-medium text-[#E0E0E0] mb-2">
                            Nome de usuário
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg text-[#E0E0E0] placeholder-[#A0A0A0] focus:border-[#E0E0E0] focus:outline-none backdrop-blur-sm"
                            placeholder="usuario123"
                            required
                            disabled={loading}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <label htmlFor="displayName" className="block text-base font-medium text-[#E0E0E0] mb-2">
                            Nome de exibição
                        </label>
                        <input
                            type="text"
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg text-[#E0E0E0] placeholder-[#A0A0A0] focus:border-[#E0E0E0] focus:outline-none backdrop-blur-sm"
                            placeholder="Seu Nome para Exibição no Chat"
                            required
                            disabled={loading}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <button
                            type="submit"
                            className="w-full bg-[#E0E0E0] text-[#1c1c1f] font-semibold py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                            disabled={loading}
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
}