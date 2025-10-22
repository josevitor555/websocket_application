import { supabase } from '../db/supabaseClient.js';
import { randomUUID } from 'crypto';

class LLMProvider {
  static async create(providerData) {
    const { id, ...providerDataWithoutId } = providerData;
    
    const providerDataWithId = {
      id: randomUUID(),
      ...providerDataWithoutId
    };
    
    const { data, error } = await supabase
      .from('llm_providers')
      .insert(providerDataWithId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create LLM provider: ${error.message}`);
    }

    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('llm_providers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find LLM provider: ${error.message}`);
    }

    return data;
  }

  static async findByName(name) {
    const { data, error } = await supabase
      .from('llm_providers')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find LLM provider: ${error.message}`);
    }

    return data;
  }

  static async getAll() {
    const { data, error } = await supabase
      .from('llm_providers')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch LLM providers: ${error.message}`);
    }

    return data;
  }

  static async update(id, providerData) {
    const { id: providerId, ...updateData } = providerData;
    
    const { data, error } = await supabase
      .from('llm_providers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update LLM provider: ${error.message}`);
    }

    return data;
  }

  static async delete(id) {
    const { data, error } = await supabase
      .from('llm_providers')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to delete LLM provider: ${error.message}`);
    }

    return data;
  }
}

export default LLMProvider;