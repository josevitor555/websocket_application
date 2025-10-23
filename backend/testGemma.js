import geminiService from './services/geminiService.js';

async function testGemma() {
  try {
    console.log('Testando modelo Gemma...');
    
    // Testar o modelo Gemma diretamente
    const response = await geminiService.generateContent(
      'Como você funciona?',
      { model: 'gemma-3-1b-it' }
    );
    
    if (response.success) {
      console.log('Resposta do Gemma:', response.response);
      console.log('Modelo usado:', response.model);
      console.log('Tokens usados:', response.usage);
    } else {
      console.error('Erro ao obter resposta do Gemma:', response.error);
    }
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

testGemma();