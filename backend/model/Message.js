import { supabase } from '../db/supabaseClient.js';

class Message {
  static async create(messageData) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messageData)
      .select('*, chat_users(*)')
      .single();

    if (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }

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