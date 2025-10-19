import { supabase } from '../db/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

class Message {
  static async create(messageData) {
    console.log('[Message] Creating message with data:', messageData);
    
    // Garantir que a mensagem tenha um ID único
    const messageWithId = {
      ...messageData,
      id: messageData.id || uuidv4(), // Gerar UUID se não estiver presente
      created_at: messageData.created_at || new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messageWithId)
      .select('*, chat_users(*)')
      .single();

    if (error) {
      console.error('[Message] Failed to create message:', error);
      throw new Error(`Failed to create message: ${error.message}`);
    }

    console.log('[Message] Created message:', data);
    return data;
  }

  static async getHistory(limit = 100) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*, chat_users(*)')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return data;
  }

  static async getByUserId(userId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*, chat_users(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch user messages: ${error.message}`);
    }

    return data;
  }
}

export default Message;