import express from 'express';
import LLMController from '../controllers/llmController.js';
import { authenticateSession } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas para provedores de LLM
router.get('/providers', LLMController.getLLMProviders);
router.get('/providers/:id', LLMController.getLLMProviderById);

// Rota para enviar prompts para LLMs (requer autenticação)
router.post('/prompt', authenticateSession, LLMController.sendPrompt);

// Rotas para histórico de interações
router.get('/interactions/user/:userId', authenticateSession, LLMController.getUserInteractions);
router.get('/interactions/:id', authenticateSession, LLMController.getInteractionById);

export default router;