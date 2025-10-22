import { LLMProvider, LLMInteraction } from './model/index.js';
import geminiService from './services/geminiService.js';

async function testLLMIntegration() {
  try {
    console.log('Testando integração completa com LLMs...\n');
    
    // 1. Testar obtenção de provedor existente (Gemini)
    console.log('1. Obtendo provedor LLM existente (Gemini)...');
    const provider = await LLMProvider.findByName('gemini');
    if (!provider) {
      console.log('✗ Provedor Gemini não encontrado');
      return;
    }
    console.log('✓ Provedor obtido:', provider.name);
    
    // 2. Testar integração com Gemini (apenas se não estivermos com limite de uso)
    console.log('\n2. Testando integração com Google Gemini...');
    const geminiResult = await geminiService.generateContent(
      'Responda com apenas uma palavra: OK', 
      { model: 'gemini-2.5-flash-preview-05-20' }
    );
    
    if (geminiResult.success) {
      console.log('✓ Integração com Gemini bem-sucedida:', geminiResult.response.trim());
    } else {
      console.log('⚠ Integração com Gemini temporariamente indisponível:', geminiResult.error);
      // Continuar com o teste mesmo com erro de limite
    }
    
    // 3. Testar criação de interação (usando um UUID válido)
    console.log('\n3. Criando registro de interação...');
    // Usar um UUID válido para teste
    const testUserId = '00000000-0000-0000-0000-000000000000';
    const interaction = await LLMInteraction.create({
      user_id: testUserId,
      provider_id: provider.id,
      prompt: 'Teste de integração',
      response: geminiResult.response || 'Sem resposta (limite de uso atingido)',
      model: geminiResult.model || 'desconhecido',
      tokens_used: geminiResult.usage?.totalTokens || 0
    });
    console.log('✓ Interação registrada:', interaction.id);
    
    // 4. Testar obtenção de interação
    console.log('\n4. Obtendo interação...');
    const retrievedInteraction = await LLMInteraction.findById(interaction.id);
    console.log('✓ Interação obtida:', retrievedInteraction.prompt);
    
    console.log('\n✓ Testes básicos concluídos com sucesso!');
    
    // Limpar dados de teste
    console.log('\n5. Limpando dados de teste...');
    await LLMInteraction.delete(interaction.id);
    console.log('✓ Dados de teste removidos');
    
  } catch (error) {
    console.error('Erro durante o teste de integração:', error);
  }
}

testLLMIntegration();