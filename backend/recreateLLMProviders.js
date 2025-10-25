#!/usr/bin/env node

/**
 * Script para recriar os provedores LLM no banco de dados
 * 
 * Este script pode ser executado para garantir que os provedores LLM
 * estejam corretamente configurados no banco de dados.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem ser definidos nas variáveis de ambiente');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Provedores LLM padrão
const defaultProviders = [
  {
    name: 'gemini',
    description: 'Google Gemini AI',
    api_key: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE',
    is_active: true
  },
  {
    name: 'gemma',
    description: 'Google Gemma AI',
    api_key: process.env.GEMMA_API_KEY || 'YOUR_GEMMA_API_KEY_HERE',
    is_active: true
  }
];

async function recreateLLMProviders() {
  console.log('Recriando provedores LLM...');
  
  try {
    // Remover provedores existentes
    const { error: deleteError } = await supabase
      .from('llm_providers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Condição que sempre é verdadeira
    
    if (deleteError) {
      console.error('Erro ao remover provedores existentes:', deleteError.message);
    }
    
    // Inserir provedores padrão
    const { data, error } = await supabase
      .from('llm_providers')
      .insert(defaultProviders)
      .select();
    
    if (error) {
      console.error('Erro ao inserir provedores:', error.message);
      return;
    }
    
    console.log('Provedores LLM recriados com sucesso:');
    data.forEach(provider => {
      console.log(`- ${provider.name}: ${provider.description}`);
    });
    
  } catch (error) {
    console.error('Erro ao recriar provedores LLM:', error.message);
  }
}

// Executar o script
recreateLLMProviders();