import { Message } from '../model/index.js';
import { HTTP_STATUS, MESSAGES } from '../constant.js';

class MessageController {
  static async getHistory(req, res) {
    try {
      const { limit = 100 } = req.query;
      const messages = await Message.getHistory(parseInt(limit));
      res.status(HTTP_STATUS.OK).json(messages);
    } catch (error) {
      console.error('Error fetching message history:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }

  static async createMessage(req, res) {
    try {
      const { userId, message } = req.body;

      if (!userId || !message) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: MESSAGES.MISSING_FIELDS 
        });
      }

      const messageData = await Message.create({
        user_id: userId,
        message: message
      });

      res.status(HTTP_STATUS.CREATED).json(messageData);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }
}

export default MessageController;