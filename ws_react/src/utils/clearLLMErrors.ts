// Utilitário para limpar mensagens de erro de LLM do localStorage

const LLM_MESSAGES_STORAGE_KEY = 'llm_chat_messages';

/**
 * Limpa todas as mensagens LLM do localStorage
 */
export function clearLLMMessagesFromLocalStorage(): void {
  try {
    localStorage.removeItem(LLM_MESSAGES_STORAGE_KEY);
    console.log('[LLM Cleanup] Mensagens LLM removidas do localStorage');
  } catch (error) {
    console.error('[LLM Cleanup] Erro ao limpar mensagens LLM do localStorage:', error);
  }
}

/**
 * Limpa apenas as mensagens de erro LLM do localStorage
 */
export function clearLLMErrorMessagesFromLocalStorage(): void {
  try {
    const storedMessages = localStorage.getItem(LLM_MESSAGES_STORAGE_KEY);
    if (storedMessages) {
      const messages = JSON.parse(storedMessages);
      
      // Filtrar mensagens, removendo apenas as que são erros
      const nonErrorMessages = messages.filter((msg: any) => !msg.isError);
      
      // Salvar apenas as mensagens que não são erros
      localStorage.setItem(LLM_MESSAGES_STORAGE_KEY, JSON.stringify(nonErrorMessages));
      console.log('[LLM Cleanup] Mensagens de erro LLM removidas do localStorage');
      console.log('[LLM Cleanup] Mantidas', nonErrorMessages.length, 'mensagens válidas');
    }
  } catch (error) {
    console.error('[LLM Cleanup] Erro ao limpar mensagens de erro LLM do localStorage:', error);
  }
}

/**
 * Limpa mensagens LLM antigas (mais de 24 horas)
 */
export function clearOldLLMMessagesFromLocalStorage(): void {
  try {
    const storedMessages = localStorage.getItem(LLM_MESSAGES_STORAGE_KEY);
    if (storedMessages) {
      const messages = JSON.parse(storedMessages);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // Filtrar mensagens, mantendo apenas as recentes
      const recentMessages = messages.filter((msg: any) => {
        const messageDate = new Date(msg.created_at);
        return messageDate > oneDayAgo;
      });
      
      // Salvar apenas as mensagens recentes
      localStorage.setItem(LLM_MESSAGES_STORAGE_KEY, JSON.stringify(recentMessages));
      console.log('[LLM Cleanup] Mensagens LLM antigas removidas do localStorage');
      console.log('[LLM Cleanup] Mantidas', recentMessages.length, 'mensagens recentes');
    }
  } catch (error) {
    console.error('[LLM Cleanup] Erro ao limpar mensagens LLM antigas do localStorage:', error);
  }
}

/**
 * Lista todas as mensagens LLM no localStorage
 */
export function listLLMMessagesFromLocalStorage(): any[] {
  try {
    const storedMessages = localStorage.getItem(LLM_MESSAGES_STORAGE_KEY);
    if (storedMessages) {
      const messages = JSON.parse(storedMessages);
      console.log('[LLM List] Mensagens LLM no localStorage:', messages);
      return messages;
    }
    console.log('[LLM List] Nenhuma mensagem LLM encontrada no localStorage');
    return [];
  } catch (error) {
    console.error('[LLM List] Erro ao listar mensagens LLM do localStorage:', error);
    return [];
  }
}