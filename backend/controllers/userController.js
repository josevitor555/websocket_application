import { User } from '../model/index.js';
import { HTTP_STATUS, MESSAGES } from '../constant.js';

class UserController {
  static async getOnlineUsers(req, res) {
    try {
      const users = await User.getOnlineUsers();
      res.status(HTTP_STATUS.OK).json(users);
    } catch (error) {
      console.error('Error fetching online users:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ 
          error: MESSAGES.USER_NOT_FOUND 
        });
      }

      res.status(HTTP_STATUS.OK).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }
}

export default UserController;