import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import messageRoutes from './messageRoutes.js';

const router = express.Router();

// Usar rotas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/messages', messageRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    message: 'Servidor está funcionando corretamente'
  });
});

export default router;