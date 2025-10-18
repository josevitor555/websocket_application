import { supabase } from '../db/supabaseClient.js';
import { randomUUID } from 'crypto';

class User {
  static async create(userData) {
    // Remover is_online e id do objeto userData para evitar erros de constraint
    const { is_online, id, ...userDataWithoutId } = userData;
    
    // Adicionar um ID gerado explicitamente
    const userDataWithId = {
      id: randomUUID(),
      ...userDataWithoutId,
      is_online: true // Definir is_online como true explicitamente
    };
    
    const { data, error } = await supabase
      .from('chat_users')
      .insert(userDataWithId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  }

  static async findByUsername(username) {
    const { data, error } = await supabase
      .from('chat_users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('chat_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return data;
  }

  static async update(id, userData) {
    // Remover id do objeto userData se estiver presente
    const { id: userId, ...updateData } = userData;
    
    const { data, error } = await supabase
      .from('chat_users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return data;
  }

  static async setOnlineStatus(id, isOnline) {
    const { data, error } = await supabase
      .from('chat_users')
      .update({ 
        is_online: isOnline, 
        last_seen: isOnline ? undefined : new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user status: ${error.message}`);
    }

    return data;
  }

  static async getOnlineUsers() {
    const { data, error } = await supabase
      .from('chat_users')
      .select('*')
      .eq('is_online', true);

    if (error) {
      throw new Error(`Failed to fetch online users: ${error.message}`);
    }

    return data;
  }
}

export default User;