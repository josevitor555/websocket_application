import { Session } from '../model/index.js';
import { HTTP_STATUS, MESSAGES } from '../constant.js';

// Middleware para autenticação de sessão
async function authenticateSession(req, res, next) {
  try {
    const { sessionToken, userId } = req.body;

    if (!sessionToken || !userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        error: MESSAGES.AUTHENTICATION_ERROR 
      });
    }

    // Verificar sessão no banco de dados
    const session = await Session.findByToken(sessionToken);

    if (!session || session.user_id !== userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        error: MESSAGES.AUTHENTICATION_ERROR 
      });
    }

    // Adicionar informações do usuário ao request
    req.user = {
      id: userId,
      sessionToken: sessionToken
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: MESSAGES.INTERNAL_ERROR 
    });
  }
}

export {
  authenticateSession
};