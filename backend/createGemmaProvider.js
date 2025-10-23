import { supabase } from './db/supabaseClient.js';

/**
 * Script para criar ou recriar o provider do Gemma no banco de dados
 * Útil para recuperar configuração após limpeza acidental do banco
 */
async function createGemmaProvider() {
  try {
    console.log('Verificando/criando provider do Gemma...');
    
    // Verificar se o provider Gemma já existe
    const { data: existingProvider, error: fetchError } = await supabase
      .from('llm_providers')
      .select('*')
      .eq('name', 'gemini') // Usamos 'gemini' pois é o nome do provider no banco
      .maybeSingle();
    
    if (fetchError) {
      console.error('Erro ao verificar provider existente:', fetchError);
      return;
    }
    
    // Se já existir, mostrar informações
    if (existingProvider) {
      console.log('✓ Provider Gemma já existe no banco de dados:');
      console.log(`  ID: ${existingProvider.id}`);
      console.log(`  Nome: ${existingProvider.name}`);
      console.log(`  Descrição: ${existingProvider.description}`);
      console.log(`  Status: ${existingProvider.is_active ? 'Ativo' : 'Inativo'}`);
      console.log(`  Criado em: ${existingProvider.created_at}`);
      return existingProvider;
    }
    
    // Se não existir, criar o provider
    console.log('Provider Gemma não encontrado. Criando novo provider...');
    
    // Usar a chave de API do ambiente ou a padrão
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyB6DTlYQNuf0nTIfyHA1FHxTB5LQDmNk70';
    
    const { data: newProvider, error: insertError } = await supabase
      .from('llm_providers')
      .insert({
        name: 'gemini',
        description: 'Google Gemini AI',
        api_key: apiKey,
        is_active: true
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Erro ao criar provider Gemma:', insertError);
      return;
    }
    
    console.log('✓ Provider Gemma criado com sucesso!');
    console.log(`  ID: ${newProvider.id}`);
    console.log(`  Nome: ${newProvider.name}`);
    console.log(`  Descrição: ${newProvider.description}`);
    console.log(`  Status: ${newProvider.is_active ? 'Ativo' : 'Inativo'}`);
    
    return newProvider;
    
  } catch (error) {
    console.error('Erro durante a criação do provider Gemma:', error);
  }
}

// Executar apenas se o script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createGemmaProvider()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default createGemmaProvider;