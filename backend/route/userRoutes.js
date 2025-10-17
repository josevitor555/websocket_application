import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

// Rota para obter usuários online
router.get('/online', UserController.getOnlineUsers);

// Rota para obter usuário por ID
router.get('/:id', UserController.getUserById);

export default router;