// Teste para verificar se a lista de LLMs está sendo carregada corretamente
import { llmList } from './data/llmList';

console.log('Lista de LLMs carregada:');
console.log('Total de modelos:', llmList.length);

llmList.forEach((llm, index) => {
  console.log(`${index + 1}. ${llm.name} (ID: ${llm.id}) - ${llm.company}`);
});

// Procurar modelos específicos
const gemmaModels = llmList.filter(llm => 
  llm.id.toLowerCase().includes('gemma') || 
  llm.name.toLowerCase().includes('gemma')
);

console.log('\nModelos Gemma encontrados:');
gemmaModels.forEach((llm, index) => {
  console.log(`${index + 1}. ${llm.name} (ID: ${llm.id})`);
});

export { llmList };