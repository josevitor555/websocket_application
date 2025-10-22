import geminiService from './services/geminiService.js';

async function testGemini() {
  try {
    console.log('Testando integração com Google Gemini...');
    
    // Testar a geração de conteúdo
    const result = await geminiService.generateContent('Olá, Gemini! Qual é o seu nome e o que você pode fazer?');
    
    if (result.success) {
      console.log('Resposta do Gemini:');
      console.log(result.response);
      console.log('\nEstatísticas de uso:');
      console.log(`Modelo: ${result.model}`);
      console.log(`Tokens usados: ${result.usage.totalTokens}`);
    } else {
      console.error('Erro ao chamar o Gemini:', result.error);
    }
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

testGemini();