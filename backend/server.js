import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
import routes from './route/index.js';

// Importar middlewares
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

// Importar models
import { User, Session } from './model/index.js';

const app = express();
const server = http.createServer(app);

// Configuração do CORS para Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*", // Em produção, especifique o domínio do frontend
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Usar rotas
app.use('/api', routes);

// Middleware de tratamento de erros
app.use(notFoundHandler);
app.use(errorHandler);

// Armazenamento em memória para usuários conectados via WebSocket
const connectedUsers = new Map();

// Eventos do Socket.IO
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  // Evento de conexão WebSocket com autenticação
  socket.on('authenticate', async (authData) => {
    try {
      const { sessionToken, userId } = authData;

      if (!sessionToken || !userId) {
        console.log('[Auth] Missing session token or user ID:', authData);
        socket.emit('auth_error', { message: 'Session token and user ID are required' });
        return;
      }

      console.log('[Auth] Authenticating user:', userId, 'with token:', sessionToken);

      // Verificar sessão no banco de dados
      const session = await Session.findByToken(sessionToken);
      console.log('[Auth] Session found in database:', session);

      if (!session || session.user_id !== userId) {
        console.log('[Auth] Invalid session - session exists:', !!session, 'user match:', session?.user_id === userId);
        socket.emit('auth_error', { message: 'Invalid session' });
        return;
      }

      // Verificar se o usuário existe
      const user = await User.findById(userId);
      console.log('[Auth] User found:', user);
      
      if (!user) {
        console.log('[Auth] User not found');
        socket.emit('auth_error', { message: 'User not found' });
        return;
      }

      // Armazenar usuário conectado
      connectedUsers.set(socket.id, {
        userId,
        sessionToken,
        socketId: socket.id,
        isOnline: true
      });

      // Atualizar status do usuário para online no banco de dados
      await User.setOnlineStatus(userId, true);
      
      // Atualizar última atividade da sessão
      await Session.update(sessionToken, {
        last_activity: new Date().toISOString()
      });

      // Emitir lista atualizada de usuários para todos
      const onlineUsers = await User.getOnlineUsers();
      console.log('[Auth] Online users:', onlineUsers);
      io.emit('users_updated', onlineUsers || []);

      // Confirmar autenticação para o cliente
      socket.emit('authenticated', { userId, sessionToken });
      console.log('[Auth] Authentication successful for user:', userId);
    } catch (error) {
      console.error('[Auth] Authentication error:', error);
      socket.emit('auth_error', { message: 'Authentication failed' });
    }
  });

  // Evento de envio de mensagem
  socket.on('send_message', async (messageData) => {
    try {
      const user = connectedUsers.get(socket.id);
      if (user) {
        console.log('[Server] Creating message for user:', user.userId, 'with data:', messageData);
        
        // Salvar mensagem no banco de dados
        const { Message } = await import('./model/index.js');
        const message = await Message.create({
          user_id: user.userId,
          message: messageData.message,
        });

        // Verificar se a mensagem foi criada corretamente
        if (!message) {
          console.error('[Server] Failed to create message - no data returned');
          socket.emit('message_error', { message: 'Failed to create message - no data returned' });
          return;
        }

        // Verificar se a mensagem tem ID e created_at
        if (!message.id || !message.created_at) {
          console.error('[Server] Created message is missing required fields:', message);
          socket.emit('message_error', { message: 'Failed to create message - missing required fields' });
          return;
        }

        console.log('[Server] Message created successfully:', message);

        // Atualizar última atividade da sessão
        await Session.update(user.sessionToken, {
          last_activity: new Date().toISOString()
        });

        // Enviar mensagem para todos os clientes conectados
        io.emit('new_message', message);
      }
    } catch (error) {
      console.error('[Server] Error processing message:', error);
      socket.emit('message_error', { message: 'Failed to process message: ' + error.message });
    }
  });

  // Evento de digitação
  socket.on('typing', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      // Enviar status de digitação para todos, exceto o próprio usuário
      socket.broadcast.emit('user_typing', {
        userId: user.userId,
        isTyping: data.isTyping
      });
    }
  });

  // Evento de desconexão
  socket.on('disconnect', async (reason) => {
    console.log('[Disconnect] Cliente desconectado:', socket.id, 'Reason:', reason);

    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log('[Disconnect] Removing user from connected users:', user.userId);
      
      // Remover usuário do armazenamento em memória
      connectedUsers.delete(socket.id);

      try {
        // Atualizar status do usuário no banco de dados
        await User.setOnlineStatus(user.userId, false);
        console.log('[Disconnect] User status updated to offline:', user.userId);

        // Manter a sessão no banco de dados, mas atualizar a última atividade
        await Session.update(user.sessionToken, {
          last_activity: new Date().toISOString()
        });
        console.log('[Disconnect] Session last activity updated:', user.sessionToken);

        // Emitir lista atualizada de usuários para todos
        const onlineUsers = await User.getOnlineUsers();
        console.log('[Disconnect] Updated online users list:', onlineUsers?.length || 0, 'users');
        io.emit('users_updated', onlineUsers || []);
      } catch (error) {
        console.error('[Disconnect] Error updating user status:', error);
      }
    } else {
      console.log('[Disconnect] No user found for socket ID:', socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor WebSocket rodando na porta ${PORT}`);
});