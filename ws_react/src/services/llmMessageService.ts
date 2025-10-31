// Serviço para gerenciar a persistência de mensagens LLM de forma consistente com mensagens de usuários

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const LLM_MESSAGES_STORAGE_KEY = 'llm_chat_messages';

interface LLMMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  isLLM: boolean;
  llm_interaction_id?: string;
  provider?: string;
  isError?: boolean;
}

// Função para fazer requisições HTTP
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Serviço para gerenciar mensagens LLM com persistência local
 */
export const llmMessageService = {
  /**
   * Salva mensagens LLM no localStorage
   * @param messages Array de mensagens LLM
   */
  saveLLMMessagesToLocalStorage(messages: LLMMessage[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LLM_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
        console.log('[LLM Message Service] Mensagens LLM salvas no localStorage:', messages.length);
      }
    } catch (error) {
      console.error('[LLM Message Service] Erro ao salvar mensagens LLM no localStorage:', error);
    }
  },
  
  /**
   * Carrega mensagens LLM do localStorage
   * @returns Array de mensagens LLM ou array vazio se não houver
   */
  loadLLMMessagesFromLocalStorage(): LLMMessage[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const storedMessages = localStorage.getItem(LLM_MESSAGES_STORAGE_KEY);
        if (storedMessages) {
          const messages = JSON.parse(storedMessages);
          console.log('[LLM Message Service] Mensagens LLM carregadas do localStorage:', messages.length);
          return messages;
        }
      }
      return [];
    } catch (error) {
      console.error('[LLM Message Service] Erro ao carregar mensagens LLM do localStorage:', error);
      return [];
    }
  },
  
  /**
   * Limpa mensagens LLM do localStorage
   */
  // clearLLMMessagesFromLocalStorage(): void {
  //   try {
  //     if (typeof localStorage !== 'undefined') {
  //       localStorage.removeItem(LLM_MESSAGES_STORAGE_KEY);
  //       console.log('[LLM Message Service] Mensagens LLM removidas do localStorage');
  //     }
  //   } catch (error) {
  //     console.error('[LLM Message Service] Erro ao limpar mensagens LLM do localStorage:', error);
  //   }
  // },
  
  /**
   * Limpa apenas as mensagens de erro LLM do localStorage
   */
  clearLLMErrorMessagesFromLocalStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const storedMessages = localStorage.getItem(LLM_MESSAGES_STORAGE_KEY);
        if (storedMessages) {
          const messages = JSON.parse(storedMessages);
          
          // Filtrar mensagens, removendo apenas as que são erros
          const nonErrorMessages = messages.filter((msg: LLMMessage) => !msg.isError);
          
          // Salvar apenas as mensagens que não são erros
          localStorage.setItem(LLM_MESSAGES_STORAGE_KEY, JSON.stringify(nonErrorMessages));
          console.log('[LLM Message Service] Mensagens de erro LLM removidas do localStorage');
          console.log('[LLM Message Service] Mantidas', nonErrorMessages.length, 'mensagens válidas');
        }
      }
    } catch (error) {
      console.error('[LLM Message Service] Erro ao limpar mensagens de erro LLM do localStorage:', error);
    }
  },
  
  /**
   * Adiciona uma nova mensagem LLM ao armazenamento local
   * @param message Nova mensagem LLM
   */
  addLLMMessageToLocalStorage(message: LLMMessage): void {
    try {
      const currentMessages = this.loadLLMMessagesFromLocalStorage();
      const updatedMessages = [...currentMessages, message];
      this.saveLLMMessagesToLocalStorage(updatedMessages);
    } catch (error) {
      console.error('[LLM Message Service] Erro ao adicionar mensagem LLM ao localStorage:', error);
    }
  },
  
  /**
   * Cria uma mensagem LLM no backend (simulando persistência)
   * Na prática, as mensagens LLM já são persistidas como interações no banco de dados
   * @param messageData Dados da mensagem LLM
   * @returns Mensagem criada
   */
  async createLLMMessage(messageData: Omit<LLMMessage, 'id' | 'created_at'>): Promise<LLMMessage> {
    // Em uma implementação real, isso poderia chamar uma API para persistir a mensagem LLM
    // Por enquanto, estamos apenas simulando a criação
    const messageWithId: LLMMessage = {
      ...messageData,
      id: `llm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    
    console.log('[LLM Message Service] Criando mensagem LLM simulada:', messageWithId);
    return messageWithId;
  },
  
  /**
   * Converte uma interação LLM em uma mensagem do chat
   * @param interaction Interação LLM do banco de dados
   * @returns Mensagem do chat formatada
   */
  convertInteractionToMessage(interaction: any): LLMMessage {
    return {
      id: `llm-${interaction.id}`,
      user_id: 'llm',
      message: interaction.response,
      created_at: interaction.created_at,
      isLLM: true,
      llm_interaction_id: interaction.id,
      provider: interaction.llm_providers?.name || 'LLM'
    };
  },
  
  /**
   * Obtém o histórico de mensagens LLM de um usuário
   * @param userId ID do usuário
   * @param limit Limite de mensagens
   * @returns Array de mensagens LLM
   */
  async getUserLLMMessages(userId: string, limit: number = 50): Promise<LLMMessage[]> {
    try {
      // Obter interações LLM do serviço existente
      const response = await apiRequest<any[]>(`/api/llm/interactions/user/${userId}?limit=${limit}`);
      
      // Converter interações em mensagens
      const messages = response.map(interaction => this.convertInteractionToMessage(interaction));
      
      // Ordenar mensagens por data de criação (crescente) para manter a ordem cronológica
      return messages.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } catch (error) {
      console.error('[LLM Message Service] Erro ao obter mensagens LLM:', error);
      return [];
    }
  },
  
  /**
   * Cria uma mensagem LLM simulada para exibição imediata
   * @param response Resposta do LLM
   * @param modelName Nome do modelo
   * @param userId ID do usuário
   * @returns Mensagem simulada
   */
  createSimulatedLLMMessage(response: string, modelName: string, userId: string): LLMMessage {
    // Usar o timestamp atual - o App.tsx cuidará de ajustar o timing para garantir a ordem correta
    const timestamp = new Date().toISOString();
    
    return {
      id: `llm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: 'llm', // Sempre usar 'llm' como user_id para mensagens LLM
      message: response,
      created_at: timestamp,
      isLLM: true,
      provider: modelName
    };
  },
  
  /**
   * Cria uma mensagem de erro LLM simulada para exibição imediata
   * @param error Erro ocorrido
   * @param modelName Nome do modelo
   * @param userId ID do usuário
   * @returns Mensagem de erro simulada
   */
  createErrorLLMMessage(error: string, modelName: string, userId: string): LLMMessage {
    // Usar o timestamp atual - o App.tsx cuidará de ajustar o timing para garantir a ordem correta
    const timestamp = new Date().toISOString();
    
    return {
      id: `llm-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: 'llm', // Sempre usar 'llm' como user_id para mensagens LLM
      message: `Erro ao obter resposta do ${modelName}: ${error}`,
      created_at: timestamp,
      isLLM: true,
      provider: modelName,
      isError: true
    };
  }
};