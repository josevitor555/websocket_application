import geminiService from './services/geminiService.js';

async function validateApiKey() {
  try {
    console.log('Validando chave de API do Google Gemini...');
    
    const isValid = await geminiService.validateApiKey();
    
    if (isValid) {
      console.log('✓ Chave de API é válida');
    } else {
      console.log('✗ Chave de API é inválida ou não tem permissões adequadas');
    }
  } catch (error) {
    console.error('Erro durante a validação:', error);
  }
}

validateApiKey();