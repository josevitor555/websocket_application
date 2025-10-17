import { supabase } from '../db/supabaseClient.js';

class Session {
  static async create(sessionData) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .upsert(sessionData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }

    return data;
  }

  static async findByToken(token) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_token', token)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find session: ${error.message}`);
    }

    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find session: ${error.message}`);
    }

    return data;
  }

  static async update(token, sessionData) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update(sessionData)
      .eq('session_token', token)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update session: ${error.message}`);
    }

    return data;
  }

  static async delete(token) {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('session_token', token);

    if (error) {
      throw new Error(`Failed to delete session: ${error.message}`);
    }

    return true;
  }
}

export default Session;