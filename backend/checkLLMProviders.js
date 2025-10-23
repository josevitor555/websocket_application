import { supabase } from './db/supabaseClient.js';

async function checkLLMProviders() {
  try {
    console.log('Verificando provedores LLM registrados...');
    
    // Listar todos os provedores
    const { data: providers, error } = await supabase
      .from('llm_providers')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar provedores:', error);
      return;
    }
    
    console.log('Provedores encontrados:', providers.length);
    
    if (providers.length > 0) {
      providers.forEach(provider => {
        console.log(`- ${provider.name}: ${provider.description} (ativo: ${provider.is_active})`);
      });
    } else {
      console.log('Nenhum provedor encontrado.');
      
      // Tentar inserir o provedor padrão
      console.log('Inserindo provedor padrão...');
      const { data: newProvider, error: insertError } = await supabase
        .from('llm_providers')
        .insert({
          name: 'gemini',
          description: 'Google Gemini AI',
          api_key: process.env.GEMINI_API_KEY,
          is_active: true
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Erro ao inserir provedor padrão:', insertError);
      } else {
        console.log('Provedor padrão inserido:', newProvider);
      }
    }
  } catch (error) {
    console.error('Erro durante a verificação:', error);
  }
}

checkLLMProviders();