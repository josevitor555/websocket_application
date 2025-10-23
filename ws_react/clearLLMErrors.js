// Script para limpar mensagens de erro LLM do localStorage
// Executar com: node clearLLMErrors.js

const LLM_MESSAGES_STORAGE_KEY = 'llm_chat_messages';

function clearLLMErrorMessagesFromLocalStorage() {
  try {
    const storedMessages = localStorage.getItem(LLM_MESSAGES_STORAGE_KEY);
    if (storedMessages) {
      const messages = JSON.parse(storedMessages);
      
      // Filtrar mensagens, removendo apenas as que são erros
      const nonErrorMessages = messages.filter((msg) => !msg.isError);
      
      // Salvar apenas as mensagens que não são erros
      localStorage.setItem(LLM_MESSAGES_STORAGE_KEY, JSON.stringify(nonErrorMessages));
      console.log('[LLM Cleanup] Mensagens de erro LLM removidas do localStorage');
      console.log('[LLM Cleanup] Mantidas', nonErrorMessages.length, 'mensagens válidas');
    } else {
      console.log('[LLM Cleanup] Nenhuma mensagem LLM encontrada no localStorage');
    }
  } catch (error) {
    console.error('[LLM Cleanup] Erro ao limpar mensagens de erro LLM do localStorage:', error);
  }
}

// Executar a limpeza
console.log('=== Limpando mensagens de erro LLM do localStorage ===');
clearLLMErrorMessagesFromLocalStorage();
console.log('=== Processo concluído ===');
console.log('Recarregue a aplicação para ver as mudanças.');