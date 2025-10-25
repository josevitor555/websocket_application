import { supabase } from '../db/supabaseClient.js';
import { randomUUID } from 'crypto';

class LLMInteraction {
  static async create(interactionData) {
    const { id, ...interactionDataWithoutId } = interactionData;
    
    const interactionDataWithId = {
      id: randomUUID(),
      ...interactionDataWithoutId,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('llm_interactions')
      .insert(interactionDataWithId)
      .select('*, llm_providers(*), chat_users(*)')
      .single();

    if (error) {
      throw new Error(`Failed to create LLM interaction: ${error.message}`);
    }

    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('llm_interactions')
      .select('*, llm_providers(*), chat_users(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find LLM interaction: ${error.message}`);
    }

    return data;
  }

  static async findByUserId(userId, limit = 50) {
    const { data, error } = await supabase
      .from('llm_interactions')
      .select('*, llm_providers(*), chat_users(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch LLM interactions: ${error.message}`);
    }

    return data;
  }

  static async findByProviderId(providerId) {
    const { data, error } = await supabase
      .from('llm_interactions')
      .select('*, llm_providers(*), chat_users(*)')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch LLM interactions: ${error.message}`);
    }

    return data;
  }

  static async getAll(limit = 100) {
    const { data, error } = await supabase
      .from('llm_interactions')
      .select('*, llm_providers(*), chat_users(*)')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch LLM interactions: ${error.message}`);
    }

    return data;
  }

  static async update(id, interactionData) {
    const { id: interactionId, ...updateData } = interactionData;
    
    const { data, error } = await supabase
      .from('llm_interactions')
      .update(updateData)
      .eq('id', id)
      .select('*, llm_providers(*), chat_users(*)')
      .single();

    if (error) {
      throw new Error(`Failed to update LLM interaction: ${error.message}`);
    }

    return data;
  }

  static async delete(id) {
    const { data, error } = await supabase
      .from('llm_interactions')
      .delete()
      .eq('id', id)
      .select('*, llm_providers(*), chat_users(*)')
      .single();

    if (error) {
      throw new Error(`Failed to delete LLM interaction: ${error.message}`);
    }

    return data;
  }
}

export default LLMInteraction;