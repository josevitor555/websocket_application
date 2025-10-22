import geminiService from './services/geminiService.js';

async function simpleGeminiTest() {
  try {
    console.log('Teste simples de integração com Google Gemini...\n');
    
    // Testar a geração de conteúdo
    const result = await geminiService.generateContent('Olá, responda com apenas uma palavra: OK');
    
    if (result.success) {
      console.log('✓ Resposta do Gemini:', result.response.trim());
      console.log('✓ Modelo usado:', result.model);
      console.log('✓ Tokens usados:', result.usage.totalTokens);
    } else {
      console.log('✗ Erro ao chamar o Gemini:', result.error);
    }
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

simpleGeminiTest();