import geminiService from './services/geminiService.js';

async function listModels() {
  try {
    console.log('Listando modelos disponíveis no Google Gemini...');
    
    // Listar os modelos disponíveis
    const result = await geminiService.listModels();
    
    if (result.success) {
      console.log('Modelos disponíveis:');
      result.models.forEach(model => {
        console.log(`- ${model.name}: ${model.displayName || 'Sem nome'}`);
        console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        console.log(`  Description: ${model.description || 'N/A'}`);
        console.log('');
      });
    } else {
      console.error('Erro ao listar modelos:', result.error);
    }
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

listModels();