import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

// Rota de login
router.post('/login', AuthController.login);

// Rota de logout
router.post('/logout', AuthController.logout);

// Rota de verificação de sessão
router.post('/verify', AuthController.verifySession);

export default router;