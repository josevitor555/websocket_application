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
        socket.emit('auth_error', { message: 'Session token and user ID are required' });
        return;
      }

      // Verificar sessão no banco de dados
      const session = await Session.findByToken(sessionToken);

      if (!session || session.user_id !== userId) {
        socket.emit('auth_error', { message: 'Invalid session' });
        return;
      }

      // Armazenar usuário conectado
      connectedUsers.set(socket.id, {
        userId,
        sessionToken,
        socketId: socket.id,
        isOnline: true
      });

      // Emitir lista atualizada de usuários para todos
      const onlineUsers = await User.getOnlineUsers();
      io.emit('users_updated', onlineUsers || []);

      // Confirmar autenticação para o cliente
      socket.emit('authenticated', { userId, sessionToken });
    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('auth_error', { message: 'Authentication failed' });
    }
  });

  // Evento de envio de mensagem
  socket.on('send_message', async (messageData) => {
    try {
      const user = connectedUsers.get(socket.id);
      if (user) {
        // Salvar mensagem no banco de dados
        const { Message } = await import('./model/index.js');
        const message = await Message.create({
          user_id: user.userId,
          message: messageData.message,
        });

        // Atualizar última atividade da sessão
        await Session.update(user.sessionToken, { 
          last_activity: new Date().toISOString() 
        });

        // Enviar mensagem para todos os clientes conectados
        io.emit('new_message', message);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('message_error', { message: 'Failed to process message' });
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
  socket.on('disconnect', async () => {
    console.log('Cliente desconectado:', socket.id);
    
    const user = connectedUsers.get(socket.id);
    if (user) {
      // Remover usuário do armazenamento em memória
      connectedUsers.delete(socket.id);

      // Atualizar status do usuário no banco de dados
      await User.setOnlineStatus(user.userId, false);

      // Remover sessão do banco de dados
      await Session.delete(user.sessionToken);

      // Emitir lista atualizada de usuários para todos
      const onlineUsers = await User.getOnlineUsers();
      io.emit('users_updated', onlineUsers || []);
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor WebSocket rodando na porta ${PORT}`);
});