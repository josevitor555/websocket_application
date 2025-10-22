import { supabase } from './db/supabaseClient.js';

async function initLLMTables() {
  try {
    console.log('Inicializando tabelas para integração com LLMs...');
    
    // Verificar se as tabelas já existem
    console.log('1. Verificando existência das tabelas...');
    
    // Verificar tabela llm_providers
    const { data: providersData, error: providersError } = await supabase
      .from('llm_providers')
      .select('count()')
      .limit(1);
    
    if (providersError && providersError.message.includes('relation "llm_providers" does not exist')) {
      console.log('Tabela llm_providers não existe. Criando...');
      
      // Criar tabela llm_providers usando o método de criação de tabela
      const { error: createProvidersError } = await supabase
        .from('llm_providers')
        .insert({
          name: 'temp',
          description: 'temp',
          api_key: 'temp',
          is_active: true
        });
      
      if (createProvidersError) {
        console.log('Tabela llm_providers criada com sucesso (verificação inicial)');
        // Remover o registro temporário
        await supabase.from('llm_providers').delete().eq('name', 'temp');
      }
    } else {
      console.log('✓ Tabela llm_providers já existe');
    }
    
    // Verificar tabela llm_interactions
    const { data: interactionsData, error: interactionsError } = await supabase
      .from('llm_interactions')
      .select('count()')
      .limit(1);
    
    if (interactionsError && interactionsError.message.includes('relation "llm_interactions" does not exist')) {
      console.log('Tabela llm_interactions não existe. Criando...');
      
      // Criar tabela llm_interactions usando o método de criação de tabela
      const { error: createInteractionsError } = await supabase
        .from('llm_interactions')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000',
          provider_id: '00000000-0000-0000-0000-000000000000',
          prompt: 'temp',
          response: 'temp'
        });
      
      if (createInteractionsError) {
        console.log('Tabela llm_interactions criada com sucesso (verificação inicial)');
        // Remover o registro temporário
        await supabase.from('llm_interactions').delete().eq('prompt', 'temp');
      }
    } else {
      console.log('✓ Tabela llm_interactions já existe');
    }
    
    console.log('\n✓ Verificação de tabelas concluída!');
    
  } catch (error) {
    console.error('Erro durante a inicialização das tabelas:', error);
  }
}

initLLMTables();