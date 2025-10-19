import { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { ChatMessage } from './components/ChatMessage';
import { UserList } from './components/UserList';
import { LLMList } from './components/LLMList';
import { ChatInput } from './components/ChatInput';
import { ConnectionStatus } from './components/ConnectionStatus';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { userService, messageService } from './lib/api';
import type { ChatMessage as ChatMessageType, ChatUser } from '../types/chat';
import { MessageSquare, LogOut } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

function ChatApp() {
  const { currentUser, sessionToken, logout, loading } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!currentUser || !sessionToken) return;

    // Create WebSocket connection to local server
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const socket = io(backendUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected with ID:', socket.id);
      setIsConnected(true);
      setReconnectAttempt(0);

      // Authenticate with the server
      console.log('[Socket.IO] Authenticating with token:', sessionToken);
      socket.emit('authenticate', {
        sessionToken,
        userId: currentUser.id
      });
    });

    socket.on('authenticated', (data) => {
      console.log('[Socket.IO] Authenticated:', data);
    });

    socket.on('auth_error', (error) => {
      console.error('[Socket.IO] Authentication error:', error);
      // Se houver erro de autenticação, fazer logout
      logout();
    });

    socket.on('new_message', (message) => {
      console.log('[App] Received message:', message);

      // Verificar se a mensagem tem os campos obrigatórios
      if (message && message.id) {
        setMessages((prev) => [...prev, message]);
      } else {
        console.warn('[App] Received message without valid ID:', message);
        // Mesmo se não tiver ID, podemos criar uma chave temporária para exibição
        if (message && message.message) {
          // Adicionar uma chave temporária para evitar o erro de React
          const messageWithTempId = {
            ...message,
            id: message.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            created_at: message.created_at || new Date().toISOString()
          };
          setMessages((prev) => [...prev, messageWithTempId]);
        }
      }
    });

    socket.on('users_updated', (users) => {
      console.log('[App] Users updated:', users);
      setUsers(users);
    });

    socket.on('user_typing', (data) => {
      if (data.userId !== currentUser?.id) {
        setTypingUser(data.username);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
          setTypingUser(null);
        }, 3000);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket.IO] Connection error:', error);
      setIsConnected(false);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket.IO] Disconnected:', reason);
      setIsConnected(false);
    });

    return () => {
      socket.close();
    };
  }, [currentUser, sessionToken]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!currentUser) return;

      try {
        // Carregar histórico de mensagens
        const messagesData = await messageService.getHistory(100);
        if (messagesData) {
          // Filtrar mensagens para garantir que todas tenham ID válido
          const validMessages = messagesData.filter(msg => msg && msg.id);
          setMessages(validMessages);
        }

        // Carregar usuários online
        const usersData = await userService.getOnlineUsers();
        if (usersData) {
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (!isConnected || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      message,
    });
  };

  const handleTyping = () => {
    if (!isConnected || !currentUser || !socketRef.current) return;

    socketRef.current.emit('typing', {
      username: currentUser.display_name,
    });
  };

  const handleReconnect = () => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  };

  // Mostrar um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    // Redirecionar para a página de login se não estiver autenticado
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="w-full px-4 py-6 h-screen max-h-[100vh] flex flex-col">
        <header className="bg-transparent rounded-2xl p-4 mb-6 border border-[#2A2A2A] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-background p-2 rounded-lg">
                <MessageSquare className="w-6 h-6 text-[#2A2A2A]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#E0E0E0]">Chat em Tempo Real</h1>
                <p className="text-sm text-[#A0A0A0]">
                  Bem-vindo, {currentUser.display_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ConnectionStatus
                isConnected={isConnected}
                reconnectAttempt={reconnectAttempt}
                onReconnect={handleReconnect}
              />
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-[#EF4444] text-[#E0E0E0] cursor-pointer rounded-lg transition-colors border border-[#2A2A2A] hover:border-[#EF4444]"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-6 min-h-0 overflow-hidden">
          <div className="hidden md:block md:col-span-1 overflow-hidden">
            <LLMList />
          </div>
          <div className="md:col-span-3 flex flex-col bg-transparent rounded-2xl border border-[#2A2A2A] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-1">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[#A0A0A0] text-center">
                    Nenhuma mensagem ainda. Seja o primeiro a enviar uma mensagem!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id || `temp-${message.created_at}-${message.message.substring(0, 10)}`}
                    message={message}
                    isOwnMessage={message.user_id === currentUser.id}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {typingUser && (
              <div className="px-6 py-2 border-t border-[#2A2A2A]">
                <p className="text-xs text-[#A0A0A0] italic">
                  {typingUser} está digitando...
                </p>
              </div>
            )}

            <div className="p-6 border-t border-[#2A2A2A]">
              <ChatInput
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                disabled={!isConnected}
              />
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1 overflow-hidden">
            <UserList users={users} currentUserId={currentUser.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  // const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<ChatApp />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
}

export default App;