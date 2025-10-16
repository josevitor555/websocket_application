import { useState, useEffect, useRef, useCallback } from 'react';
import { LoginForm } from './components/LoginForm';
import { ChatMessage } from './components/ChatMessage';
import { UserList } from './components/UserList';
import { ChatInput } from './components/ChatInput';
import { ConnectionStatus } from './components/ConnectionStatus';
import { useWebSocket } from './hooks/useWebSocket';
import { supabase } from './lib/supabase';
import type { ChatMessage as ChatMessageType, ChatUser } from '../types/chat';
import { MessageSquare, LogOut } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
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

      const { data: messagesData } = await supabase
        .from('chat_messages')
        .select('*, chat_users(*)')
        .order('created_at', { ascending: true })
        .limit(100);

      if (messagesData) {
        setMessages(messagesData);
      }

      const { data: usersData } = await supabase
        .from('chat_users')
        .select('*')
        .eq('is_online', true);

      if (usersData) {
        setUsers(usersData);
      }
    };

    loadInitialData();
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = async (username: string, displayName: string) => {
    try {
      // First, let's check if we can access the database
      const { error: testError } = await supabase
        .from('chat_users')
        .select('id')
        .limit(1);

      if (testError && testError.message.includes('401')) {
        console.error('Authentication error. Check your Supabase credentials.');
        console.error('Make sure your Supabase project has the correct anon key configured.');
        return;
      }

      const { data: existingUser, error: selectError } = await supabase
        .from('chat_users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (selectError) {
        console.error('Error checking existing user:', selectError);
        return;
      }

      let user: ChatUser;

      if (existingUser) {
        user = existingUser;
        const { error: updateError } = await supabase
          .from('chat_users')
          .update({ display_name: displayName, is_online: true })
          .eq('id', existingUser.id);

        if (updateError) {
          console.error('Error updating user:', updateError);
          return;
        }
        
        // Refresh user data after update
        const { data: updatedUser } = await supabase
          .from('chat_users')
          .select('*')
          .eq('id', existingUser.id)
          .single();
        
        if (updatedUser) {
          user = updatedUser;
        }
      } else {
        const { data: newUser, error: insertError } = await supabase
          .from('chat_users')
          .insert({
            username,
            display_name: displayName,
            is_online: true
          })
          .select()
          .single();

        if (insertError) {
          console.error('Failed to create user:', insertError);
          return;
        }
        
        if (!newUser) {
          console.error('Failed to create user - no data returned');
          return;
        }
        
        user = newUser;
      }

      const token = `${user.id}_${Date.now()}`;
      setCurrentUser(user);
      setSessionToken(token);
    } catch (error) {
      console.error('Unexpected error during login:', error);
    }
  };

  const handleLogout = async () => {
    if (currentUser) {
      try {
        const { error } = await supabase
          .from('chat_users')
          .update({ is_online: false, last_seen: new Date().toISOString() })
          .eq('id', currentUser.id);
      
        if (error) {
          console.error('Error updating user status on logout:', error);
        }
      } catch (error) {
        console.error('Unexpected error during logout:', error);
      }
    }
    setCurrentUser(null);
    setSessionToken(null);
    setMessages([]);
    setUsers([]);
  };

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
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
        <header className="bg-[#1A1A1A] rounded-2xl p-4 mb-6 border border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#3A86FF] p-2 rounded-lg">
                <MessageSquare className="w-6 h-6 text-[#E0E0E0]" />
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
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-[#EF4444] text-[#E0E0E0] rounded-lg transition-colors border border-[#2A2A2A] hover:border-[#EF4444]"
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
