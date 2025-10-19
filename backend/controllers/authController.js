import { User, Session } from '../model/index.js';
import { HTTP_STATUS, MESSAGES } from '../constant.js';

class AuthController {
  static async login(req, res) {
    try {
      const { username, displayName } = req.body;

      if (!username || !displayName) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: MESSAGES.MISSING_FIELDS 
        });
      }

      // Verificar se usuário já existe
      let user = await User.findByUsername(username);

      if (user) {
        // Atualizar usuário existente
        user = await User.update(user.id, { 
          display_name: displayName, 
          is_online: true 
        });
      } else {
        // Criar novo usuário
        user = await User.create({
          username,
          display_name: displayName,
          is_online: true
        });
      }

      // Gerar token de sessão
      const sessionToken = `${user.id}_${Date.now()}`;

      // Criar sessão no banco de dados
      await Session.create({
        session_token: sessionToken,
        user_id: user.id,
        connected_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
      });

      // Retornar a estrutura esperada pelo frontend
      res.status(HTTP_STATUS.OK).json({
        user: {
          id: user.id,
          username: user.username,
          display_name: user.display_name,
          is_online: user.is_online,
          last_seen: user.last_seen,
          created_at: user.created_at
        },
        sessionToken: sessionToken,
        message: MESSAGES.LOGIN_SUCCESS
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }

  static async logout(req, res) {
    try {
      const { userId, sessionToken } = req.body;

      if (!userId || !sessionToken) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: MESSAGES.MISSING_FIELDS 
        });
      }

      // Atualizar status do usuário
      await User.setOnlineStatus(userId, false);

      // Remover sessão do banco de dados
      await Session.delete(sessionToken);

      res.status(HTTP_STATUS.OK).json({ 
        message: MESSAGES.LOGOUT_SUCCESS 
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }

  static async verifySession(req, res) {
    try {
      const { userId, sessionToken } = req.body;

      if (!userId || !sessionToken) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: MESSAGES.MISSING_FIELDS 
        });
      }

      // Verificar sessão no banco de dados
      const session = await Session.findByToken(sessionToken);

      if (!session || session.user_id !== userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
          error: 'Invalid session' 
        });
      }

      // Verificar se o usuário existe
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ 
          error: 'User not found' 
        });
      }

      res.status(HTTP_STATUS.OK).json({ 
        message: 'Session valid',
        user: user
      });
    } catch (error) {
      console.error('Session verification error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }
}

export default AuthController;