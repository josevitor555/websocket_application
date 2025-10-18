import { useState, useEffect, useRef, useCallback } from 'react';
import { LoginForm } from './components/LoginForm';
import { ChatMessage } from './components/ChatMessage';
import { UserList } from './components/UserList';
import { ChatInput } from './components/ChatInput';
import { ConnectionStatus } from './components/ConnectionStatus';
import { useWebSocket } from './hooks/useWebSocket';
import { useAuth } from './hooks/useAuth';
import { userService, messageService } from './lib/api';
import type { ChatMessage as ChatMessageType, ChatUser } from '../types/chat';
import { MessageSquare, LogOut } from 'lucide-react';

function App() {
  const { currentUser, sessionToken, logout } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const wsUrl = sessionToken && currentUser
    ? `${import.meta.env.VITE_SUPABASE_URL.replace('https://', 'wss://')}/functions/v1/chat-websocket?session=${sessionToken}&userId=${currentUser.id}`
    : '';

  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'connected':
        console.log('WebSocket connected:', message);
        break;

      case 'new_message':
        setMessages((prev) => [...prev, message.message]);
        break;

      case 'user_joined':
        if (message.user) {
          setUsers((prev) => {
            const existing = prev.find(u => u.id === message.user.id);
            if (existing) {
              return prev.map(u => u.id === message.user.id ? message.user : u);
            }
            return [...prev, message.user];
          });
        }
        break;

      case 'user_left':
        if (message.user) {
          setUsers((prev) => prev.map(u =>
            u.id === message.user.id ? { ...u, is_online: false } : u
          ));
        }
        break;

      case 'user_typing':
        if (message.userId !== currentUser?.id) {
          setTypingUser(message.username);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = window.setTimeout(() => {
            setTypingUser(null);
          }, 3000);
        }
        break;
    }
  }, [currentUser?.id]);

  const { isConnected, sendMessage, reconnect, reconnectAttempt } = useWebSocket({
    url: wsUrl,
    onMessage: handleWebSocketMessage,
    onOpen: () => {
      console.log('WebSocket connection opened');
    },
    onClose: () => {
      console.log('WebSocket connection closed');
    },
  });

  useEffect(() => {
    const loadInitialData = async () => {
      if (!currentUser) return;

      try {
        // Carregar histórico de mensagens
        const messagesData = await messageService.getHistory(100);
        if (messagesData) {
          setMessages(messagesData);
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
    if (!isConnected) return;
    sendMessage({
      type: 'message',
      message,
    });
  };

  const handleTyping = () => {
    if (!isConnected || !currentUser) return;
    sendMessage({
      type: 'typing',
      username: currentUser.display_name,
    });
  };

  if (!currentUser) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
        <header className="bg-[#1A1A1A] rounded-2xl p-4 mb-6 border border-[#2A2A2A]">
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
                onReconnect={reconnect}
              />
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-background hover:bg-background text-[#121212] rounded-lg transition-colors border border-[#2A2A2A]"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          <div className="lg:col-span-3 flex flex-col bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
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
                    key={message.id}
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

          <div className="hidden lg:block">
            <UserList users={users} currentUserId={currentUser.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;