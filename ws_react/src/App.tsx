import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { ChatMessage } from './components/ChatMessage';
import { UserList } from './components/UserList';
import { ChatInput } from './components/ChatInput';
// import { LLMMentionModal } from './components/LLMMentionModal';
import { ConnectionStatus } from './components/ConnectionStatus';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SectionList } from './components/SectionList';
import { useAuth } from './hooks/useAuth';
import { useTypingIndicator } from './hooks/useTypingIndicator';
import { userService, messageService } from './lib/api';
import { llmService } from './services/llmService';
import { llmMessageService } from './services/llmMessageService';
import { clearLLMErrorMessagesFromLocalStorage } from './utils/clearLLMErrors';
import type { ChatMessage as ChatMessageType, ChatUser } from '../types/chat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { motion, easeOut } from 'framer-motion';
import { io, Socket } from 'socket.io-client';

console.log('[App] Serviço LLM carregado:', llmService);

function ChatApp() {
  const { currentUser, sessionToken, logout, loading } = useAuth();
  const { typingUser, startTypingIndicator, clearTypingIndicator } = useTypingIndicator(3000);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();
  const hasLoadedInitialMessages = useRef(false);

  // Limpar mensagens de erro LLM do localStorage ao carregar a aplicação
  useEffect(() => {
    console.log('[App] Limpando mensagens de erro LLM do localStorage...');
    clearLLMErrorMessagesFromLocalStorage();
  }, []);

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

    socket.on('authenticated', async (data) => {
      console.log('[Socket.IO] Authenticated:', data);

      // Carregar histórico de mensagens quando autenticado
      if (!hasLoadedInitialMessages.current) {
        try {
          // Carregar histórico de mensagens do chat
          const messagesData = await messageService.getHistory(100);
          let allMessages: ChatMessageType[] = [];
          let validMessages: ChatMessageType[] = [];
          
          if (messagesData) {
            // Filtrar mensagens para garantir que todas tenham ID válido
            validMessages = messagesData.filter(msg => msg && msg.id);
            allMessages = [...validMessages];
          }
          
          // Carregar mensagens LLM do localStorage primeiro (para exibição imediata)
          const localLLMMessages = llmMessageService.loadLLMMessagesFromLocalStorage();
          console.log('[App] Mensagens LLM carregadas do localStorage:', localLLMMessages?.length || 0);
          
          // Combinar mensagens do chat com mensagens LLM do localStorage
          allMessages = [...allMessages, ...localLLMMessages];
          
          // Carregar histórico de mensagens LLM do banco de dados (para atualizar com dados reais)
          try {
            const dbLLMMessages = await llmMessageService.getUserLLMMessages(currentUser.id, 50);
            console.log('[App] Mensagens LLM carregadas do banco de dados:', dbLLMMessages?.length || 0);
            
            // Filtrar mensagens LLM do localStorage que já foram persistidas no banco
            const persistedLLMMessageIds = new Set(dbLLMMessages.map(msg => msg.llm_interaction_id));
            const nonPersistedLocalMessages = localLLMMessages.filter(msg => 
              !msg.llm_interaction_id || !persistedLLMMessageIds.has(msg.llm_interaction_id)
            );
            
            // Combinar mensagens do chat com mensagens LLM do banco e mensagens locais não persistidas
            allMessages = [...validMessages, ...dbLLMMessages, ...nonPersistedLocalMessages];
            
            // Atualizar o localStorage com as mensagens mais recentes do banco
            llmMessageService.saveLLMMessagesToLocalStorage([...dbLLMMessages, ...nonPersistedLocalMessages]);
          } catch (llmError) {
            console.error('[App] Erro ao carregar mensagens LLM do banco de dados:', llmError);
            // Usar apenas as mensagens do localStorage e do chat em caso de erro
          }
          
          // Ordenar todas as mensagens por data de criação (crescente)
          allMessages.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          
          setMessages(allMessages);
          hasLoadedInitialMessages.current = true;
        } catch (error) {
          console.error('Error loading initial messages:', error);
        }
      }
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
        setMessages((prev) => {
          // Verificar se a mensagem já existe para evitar duplicatas
          const messageExists = prev.some(msg => msg.id === message.id);
          if (messageExists) {
            return prev;
          }
          
          // Adicionar nova mensagem e ordenar por data de criação (crescente)
          const newMessages = [...prev, message];
          return newMessages.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
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

          setMessages((prev) => {
            // Verificar se a mensagem já existe para evitar duplicatas
            const messageExists = prev.some(msg =>
              msg.message === messageWithTempId.message &&
              msg.user_id === messageWithTempId.user_id &&
              Math.abs(new Date(msg.created_at).getTime() - new Date(messageWithTempId.created_at).getTime()) < 5000 // 5 segundos
            );
            if (messageExists) {
              return prev;
            }
            
            // Adicionar nova mensagem e ordenar por data de criação (crescente)
            const newMessages = [...prev, messageWithTempId];
            return newMessages.sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          });
        }
      }
    });

    socket.on('users_updated', (users) => {
      console.log('[App] Users updated:', users);
      setUsers(users);
    });

    socket.on('user_typing', (data) => {
      // Verificar se o usuário que está digitando não é o usuário atual
      if (data.userId !== currentUser?.id) {
        // Usar o username se disponível, senão usar o userId
        const typingUsername = data.username || `User_${data.userId.substring(0, 8)}`;
        startTypingIndicator(typingUsername);
      }
    });

    socket.on('user_stop_typing', (data) => {
      // Verificar se o usuário que parou de digitar é o mesmo que está sendo exibido
      const typingUsername = data.username || `User_${data.userId.substring(0, 8)}`;
      if (typingUser === typingUsername) {
        clearTypingIndicator();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket.IO] Connection error:', error);
      setIsConnected(false);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket.IO] Disconnected:', reason);
      setIsConnected(false);
      clearTypingIndicator();
    });

    return () => {
      socket.close();
      clearTypingIndicator();
    };
  }, [currentUser, sessionToken, startTypingIndicator, clearTypingIndicator]);

  // Load initial users data
  useEffect(() => {
    const loadInitialUsers = async () => {
      if (!currentUser) return;

      try {
        // Carregar usuários online
        const usersData = await userService.getOnlineUsers();
        if (usersData) {
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error loading initial users:', error);
      }
    };

    loadInitialUsers();
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    console.log('[App] handleSendMessage chamado com mensagem:', message);
    
    if (!isConnected || !socketRef.current || !currentUser || !sessionToken) {
      console.log('[App] Condições não atendidas - isConnected:', isConnected, 'socketRef.current:', !!socketRef.current, 'currentUser:', !!currentUser, 'sessionToken:', !!sessionToken);
      return;
    }

    // Verificar se a mensagem contém menções a LLMs (@nome_do_modelo)
    const llmMentionRegex = /@(\w+)/g;
    const mentions = message.match(llmMentionRegex);
    
    console.log('[App] Menções encontradas:', mentions);
    
    // Sempre enviar a mensagem original do usuário primeiro
    console.log('[App] Enviando mensagem original:', message);
    socketRef.current.emit('send_message', {
      message,
    });
    
    // Processar menções a LLMs após enviar a mensagem do usuário
    if (mentions && mentions.length > 0 && currentUser) {
      console.log('[App] Processando menções...');
      
      // Importar a lista de LLMs uma vez
      let llmListData;
      try {
        const llmListModule = await import('./data/llmList');
        llmListData = llmListModule.llmList;
        console.log('[App] Lista de LLMs carregada:', llmListData.length, 'modelos');
        
        // Verificar especificamente por modelos Gemma
        const gemmaModels = llmListData.filter((llm: any) => 
          llm.id.toLowerCase().includes('gemma') || 
          llm.name.toLowerCase().includes('gemma')
        );
        
        console.log('[App] Modelos Gemma disponíveis:', gemmaModels.map((m: any) => m.id));
      } catch (error) {
        console.error('[App] Erro ao carregar lista de LLMs:', error);
        return;
      }
      
      // Processar cada menção a LLM
      for (const mention of mentions) {
        const modelName = mention.substring(1); // Remover o @
        console.log('[App] Nome do modelo extraído:', modelName);
        
        // Verificação específica para Gemma
        if (modelName.toLowerCase() === 'gemma') {
          console.log('[App] Menção direta a Gemma detectada');
          
          // Procurar qualquer modelo que contenha "gemma"
          const gemmaModel = llmListData.find((l: any) => 
            l.id.toLowerCase().includes('gemma') || 
            l.name.toLowerCase().includes('gemma')
          );
          
          if (gemmaModel) {
            console.log('[App] Modelo Gemma encontrado:', gemmaModel.name);
            // Usar este modelo
          } else {
            console.log('[App] Nenhum modelo Gemma encontrado na lista');
            // Continuar com a busca normal
          }
        }
        
        // Verificar se é um modelo LLM válido
        const llm = llmListData.find((l: any) => {
          const match = l.id.toLowerCase().includes(modelName.toLowerCase()) || 
                        l.name.toLowerCase().includes(modelName.toLowerCase());
          console.log(`[App] Verificando modelo ${l.name} (id: ${l.id}) - match: ${match}`);
          return match;
        });
        
        if (llm) {
          console.log('[App] Modelo encontrado:', llm.name);
          
          // Chamar o modelo LLM real e mostrar resposta na UI
          console.log(`[LLM Test] Mensagem para ${llm.name}: ${message}`);
          
          try {
            const response = await llmService.testLLM(llm.id, message, currentUser.id, sessionToken);
          
            if (response.success && response.response) {
              // Criar uma mensagem simulada da LLM para exibir na UI usando o novo serviço
              const llmMessage = llmMessageService.createSimulatedLLMMessage(
                response.response, 
                llm.name, 
                currentUser.id
              );
              
              // Adicionar a mensagem da LLM ao estado de mensagens com ordenação correta
              setMessages((prev) => {
                const newMessages = [...prev, llmMessage];
                return newMessages.sort((a, b) => 
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
              });
              
              // Salvar no localStorage para persistência temporária
              llmMessageService.addLLMMessageToLocalStorage(llmMessage);
              
              // Logar no console também
              console.log(`[LLM Test] Resposta do ${llm.name}:`, response.response);
              console.log(`[LLM Test] Tokens usados:`, response.usage);
            } else {
              // Criar uma mensagem de erro da LLM para exibir na UI usando o novo serviço
              const errorMessage = llmMessageService.createErrorLLMMessage(
                response.error || 'Erro desconhecido', 
                llm.name, 
                currentUser.id
              );
              
              // Adicionar a mensagem de erro ao estado de mensagens com ordenação correta
              setMessages((prev) => {
                const newMessages = [...prev, errorMessage];
                return newMessages.sort((a, b) => 
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
              });
              
              // Salvar no localStorage para persistência temporária
              llmMessageService.addLLMMessageToLocalStorage(errorMessage);
              
              // Logar erro no console
              console.log(`[LLM Test] Erro ao obter resposta do ${llm.name}:`, response.error || 'Erro desconhecido');
            }
          } catch (error) {
            console.error('[LLM Test] Erro ao chamar LLM:', error);
            
            // Criar uma mensagem de erro da LLM para exibir na UI usando o novo serviço
            const errorMessage = llmMessageService.createErrorLLMMessage(
              (error as Error).message, 
              llm.name, 
              currentUser.id
            );
            
            // Adicionar a mensagem de erro ao estado de mensagens com ordenação correta
            setMessages((prev) => {
              const newMessages = [...prev, errorMessage];
              return newMessages.sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
            });
            
            // Salvar no localStorage para persistência temporária
            llmMessageService.addLLMMessageToLocalStorage(errorMessage);
          }
        } else {
          console.log('[App] Nenhum modelo correspondente encontrado para:', modelName);
        }
      }
    } else {
      console.log('[App] Nenhuma menção encontrada ou usuário não autenticado');
    }
  };

  const handleTyping = () => {
    if (!isConnected || !currentUser || !socketRef.current) return;

    socketRef.current.emit('typing', {
      username: currentUser.display_name,
      userId: currentUser.id
    });
  };

  const handleReconnect = () => {
    if (socketRef.current) {
      socketRef.current.connect();
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

  // Mostrar um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    // Redirecionar para a página de login se não estiver autenticado
    navigate('/login');
    return <LoginForm />;
  }

  return (
    <motion.div
      className="min-h-screen relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background pattern dark mode with grid lines and radial gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#0f0f10]">
        {/* Grid pattern only around the radial gradient area */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_100%_0%,rgba(160,160,160,0.25),transparent)]"></div>
        {/* Visible grid lines only in the radial area */}
        <div 
          className="absolute inset-0 opacity-60" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, #a0a0a0 1px, transparent 1px),
              linear-gradient(to bottom, #a0a0a0 1px, transparent 1px)
            `,
            backgroundSize: '3rem 2rem',
            mask: 'radial-gradient(circle 200px at 100% 0%, white, transparent)',
            WebkitMask: 'radial-gradient(circle 320px at 100% 0%, white, transparent)'
          }}
        ></div>
      </div>
      
      <div className="w-full px-4 py-6 h-screen max-h-[100vh] flex flex-col">
        <motion.header
          className="bg-white/[0.05] backdrop-blur-3xl rounded-2xl p-4 mb-6 border border-white/[0.3] flex-shrink-0"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-background p-2 rounded-lg">
                <FontAwesomeIcon icon={faComments} className="w-6 h-6 text-[#fafafa]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#E0E0E0]"> IAArena </h1>
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
                <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </motion.header>

        <motion.div
          className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-6 min-h-0 overflow-hidden"
          variants={containerVariants}
        >
          <motion.div
            className="hidden md:block md:col-span-1 overflow-hidden"
            variants={itemVariants}
          >
            <SectionList
              sections={[
                // Seções de hoje
                {
                  id: 'today-1',
                  title: 'Discussão técnica',
                  icon: 'fa-laptop-code',
                  date: new Date()
                },
                {
                  id: 'today-2',
                  title: 'Reunião de equipe',
                  icon: 'fa-users',
                  date: new Date()
                },
                // Seções de ontem
                {
                  id: 'yesterday-1',
                  title: 'Planejamento semanal',
                  icon: 'fa-calendar-alt',
                  date: new Date(Date.now() - 24 * 60 * 60 * 1000)
                },
                {
                  id: 'yesterday-2',
                  title: 'Revisão de código',
                  icon: 'fa-code',
                  date: new Date(Date.now() - 24 * 60 * 60 * 1000)
                },
                // Seções da semana passada
                {
                  id: 'last-week-1',
                  title: 'Feedback do cliente',
                  icon: 'fa-comment',
                  date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                },
                {
                  id: 'last-week-2',
                  title: 'Análise de métricas',
                  icon: 'fa-chart-bar',
                  date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
                },
                // Seções temáticas
                {
                  id: 'theme-1',
                  title: 'IAArena',
                  icon: 'fa-robot',
                  date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                  id: 'theme-2',
                  title: 'Projeto WebSocket',
                  icon: 'fa-network-wired',
                  date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
                },
                {
                  id: 'theme-3',
                  title: 'Desenvolvimento Frontend',
                  icon: 'fa-paint-brush',
                  date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
                }
              ]}
            />
          </motion.div>

          <motion.div
            className="md:col-span-3 flex flex-col bg-transparent rounded-2xl border border-[#2A2A2A] overflow-hidden"
            variants={itemVariants}
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-1">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id || `temp-${message.created_at}-${message.message.substring(0, 10)}`}
                  message={message}
                  isOwnMessage={message.user_id === currentUser.id}
                />
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Removido o indicador de usuário digitando daqui */}
            <div className="p-6 border-t border-[#2A2A2A]">
              <ChatInput
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                disabled={!isConnected}
              />
            </div>
          </motion.div>

          <motion.div
            className="hidden lg:block lg:col-span-1 overflow-hidden"
            variants={itemVariants}
          >
            <UserList
              users={users}
              currentUserId={currentUser.id}
              typingUser={typingUser || undefined}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatApp />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
}

export default App;