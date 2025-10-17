import express from 'express';
import MessageController from '../controllers/messageController.js';

const router = express.Router();

// Rota para obter histórico de mensagens
router.get('/history', MessageController.getHistory);

// Rota para criar uma nova mensagem
router.post('/', MessageController.createMessage);

export default router;