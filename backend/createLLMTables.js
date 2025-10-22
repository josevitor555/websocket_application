import { supabase } from './db/supabaseClient.js';

async function createLLMTables() {
  try {
    console.log('Criando tabelas para integração com LLMs...');
    
    // Criar tabela llm_providers
    console.log('1. Criando tabela llm_providers...');
    const { error: providersError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS llm_providers (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name text UNIQUE NOT NULL,
          description text,
          api_key text,
          is_active boolean DEFAULT true,
          created_at timestamptz DEFAULT now()
        );
      `
    });
    
    if (providersError) {
      console.error('Erro ao criar tabela llm_providers:', providersError);
    } else {
      console.log('✓ Tabela llm_providers criada com sucesso!');
    }
    
    // Criar tabela llm_interactions
    console.log('2. Criando tabela llm_interactions...');
    const { error: interactionsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS llm_interactions (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id uuid NOT NULL REFERENCES chat_users (id) ON DELETE CASCADE,
          provider_id uuid NOT NULL REFERENCES llm_providers (id) ON DELETE CASCADE,
          prompt text NOT NULL,
          response text,
          model text,
          tokens_used integer,
          created_at timestamptz DEFAULT now()
        );
      `
    });
    
    if (interactionsError) {
      console.error('Erro ao criar tabela llm_interactions:', interactionsError);
    } else {
      console.log('✓ Tabela llm_interactions criada com sucesso!');
    }
    
    // Criar índices
    console.log('3. Criando índices...');
    const { error: indexError1 } = await supabase.rpc('execute_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_llm_interactions_user_id ON llm_interactions (user_id);'
    });
    
    if (indexError1) {
      console.error('Erro ao criar índice idx_llm_interactions_user_id:', indexError1);
    } else {
      console.log('✓ Índice idx_llm_interactions_user_id criado com sucesso!');
    }
    
    const { error: indexError2 } = await supabase.rpc('execute_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_llm_interactions_created_at ON llm_interactions (created_at DESC);'
    });
    
    if (indexError2) {
      console.error('Erro ao criar índice idx_llm_interactions_created_at:', indexError2);
    } else {
      console.log('✓ Índice idx_llm_interactions_created_at criado com sucesso!');
    }
    
    const { error: indexError3 } = await supabase.rpc('execute_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_llm_providers_name ON llm_providers (name);'
    });
    
    if (indexError3) {
      console.error('Erro ao criar índice idx_llm_providers_name:', indexError3);
    } else {
      console.log('✓ Índice idx_llm_providers_name criado com sucesso!');
    }
    
    // Inserir provedor padrão (Gemini)
    console.log('4. Inserindo provedor padrão (Gemini)...');
    const { error: insertError } = await supabase.rpc('execute_sql', {
      sql: `
        INSERT INTO llm_providers (name, description, api_key, is_active)
        VALUES ('gemini', 'Google Gemini AI', 'AIzaSyB6DTlYQNuf0nTIfyHA1FHxTB5LQDmNk70', true)
        ON CONFLICT (name) DO NOTHING;
      `
    });
    
    if (insertError) {
      console.error('Erro ao inserir provedor padrão:', insertError);
    } else {
      console.log('✓ Provedor padrão (Gemini) inserido com sucesso!');
    }
    
    console.log('\n✓ Todas as tabelas e índices foram criados com sucesso!');
    
  } catch (error) {
    console.error('Erro durante a criação das tabelas:', error);
  }
}

createLLMTables();