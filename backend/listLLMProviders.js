import { supabase } from './db/supabaseClient.js';

/**
 * Script para listar todos os providers LLM cadastrados no banco de dados
 */
async function listLLMProviders() {
  try {
    console.log('Listando providers LLM...');
    
    // Buscar todos os providers
    const { data: providers, error } = await supabase
      .from('llm_providers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar providers:', error);
      return;
    }
    
    if (!providers || providers.length === 0) {
      console.log('Nenhum provider LLM encontrado no banco de dados.');
      return;
    }
    
    console.log(`\nEncontrados ${providers.length} provider(s) LLM:\n`);
    
    providers.forEach((provider, index) => {
      console.log(`${index + 1}. ${provider.name}`);
      console.log(`   ID: ${provider.id}`);
      console.log(`   Descrição: ${provider.description}`);
      console.log(`   Status: ${provider.is_active ? 'Ativo' : 'Inativo'}`);
      console.log(`   Criado em: ${new Date(provider.created_at).toLocaleString('pt-BR')}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('Erro durante a listagem dos providers:', error);
  }
}

// Executar apenas se o script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  listLLMProviders();
}

export default listLLMProviders;