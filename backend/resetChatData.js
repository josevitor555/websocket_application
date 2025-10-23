import { supabase } from './db/supabaseClient.js';

/**
 * Script para redefinir apenas os dados de chat (mensagens, usuários e sessões)
 * mantendo os providers LLM configurados e recriando dados essenciais
 */
async function resetChatData() {
  try {
    console.log('Iniciando redefinição dos dados de chat...');
    
    // Limpar tabelas de chat em ordem correta para evitar erros de FK
    console.log('Limpando tabela de mensagens...');
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .gt('id', '00000000-0000-0000-0000-000000000000');
    
    if (messagesError) {
      console.error('Erro ao limpar mensagens:', messagesError);
    } else {
      console.log('✓ Mensagens limpas com sucesso!');
    }
    
    console.log('Limpando tabela de sessões...');
    const { error: sessionsError } = await supabase
      .from('chat_sessions')
      .delete()
      .gt('id', '00000000-0000-0000-0000-000000000000');
    
    if (sessionsError) {
      console.error('Erro ao limpar sessões:', sessionsError);
    } else {
      console.log('✓ Sessões limpas com sucesso!');
    }
    
    console.log('Limpando tabela de usuários...');
    const { error: usersError } = await supabase
      .from('chat_users')
      .delete()
      .gt('id', '00000000-0000-0000-0000-000000000000');
    
    if (usersError) {
      console.error('Erro ao limpar usuários:', usersError);
    } else {
      console.log('✓ Usuários limpos com sucesso!');
    }
    
    // Limpar também as interações LLM (mas manter os providers)
    console.log('Limpando tabela de interações LLM...');
    const { error: interactionsError } = await supabase
      .from('llm_interactions')
      .delete()
      .gt('id', '00000000-0000-0000-0000-000000000000');
    
    if (interactionsError) {
      console.error('Erro ao limpar interações LLM:', interactionsError);
    } else {
      console.log('✓ Interações LLM limpas com sucesso!');
    }
    
    // Verificar se o provider Gemini ainda existe
    console.log('Verificando provider Gemini...');
    const { data: geminiProvider, error: providerError } = await supabase
      .from('llm_providers')
      .select('*')
      .eq('name', 'gemini')
      .maybeSingle();
    
    if (providerError) {
      console.error('Erro ao verificar provider Gemini:', providerError);
    } else if (!geminiProvider) {
      // Recriar o provider padrão se não existir
      console.log('Provider Gemini não encontrado. Recriando...');
      const { error: createError } = await supabase
        .from('llm_providers')
        .insert({
          name: 'gemini',
          description: 'Google Gemini AI',
          api_key: process.env.GEMINI_API_KEY || 'AIzaSyB6DTlYQNuf0nTIfyHA1FHxTB5LQDmNk70',
          is_active: true
        });
      
      if (createError) {
        console.error('Erro ao recriar provider Gemini:', createError);
      } else {
        console.log('✓ Provider Gemini recriado com sucesso!');
      }
    } else {
      console.log('✓ Provider Gemini já existe e está configurado!');
    }
    
    console.log('\n✅ Redefinição concluída com sucesso!');
    console.log('Os dados de chat foram limpos, mas os providers LLM foram mantidos.');
    
  } catch (error) {
    console.error('Erro durante a redefinição dos dados:', error);
  }
}

// Executar apenas se o script for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  resetChatData();
}

export default resetChatData;