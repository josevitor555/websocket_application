// Script para limpar mensagens de erro de LLM do localStorage
// Executar com: npx tsx clearLLMErrors.ts

import { clearLLMErrorMessagesFromLocalStorage } from './utils/clearLLMErrors';

console.log('=== Limpando mensagens de erro LLM do localStorage ===');

// Limpar mensagens de erro
clearLLMErrorMessagesFromLocalStorage();

console.log('=== Processo concluído ===');
console.log('Recarregue a aplicação para ver as mudanças.');