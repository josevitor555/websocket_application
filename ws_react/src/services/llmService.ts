// Serviço para interagir com LLMs através do backend
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Interface para os dados do prompt
interface PromptData {
  userId: string;
  sessionToken?: string;
  prompt: string;
  providerId?: string;
  model?: string;
  options?: Record<string, any>;
}

// Interface para a resposta do LLM
interface LLMResponse {
  success: boolean;
  response?: string;
  error?: string;
  interactionId?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost?: number;
  provider?: {
    id: string;
    name: string;
  };
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

// Serviço de LLM
export const llmService = {
  /**
   * Envia um prompt para um LLM e retorna a resposta
   * @param promptData Dados do prompt a ser enviado
   * @returns Resposta do LLM
   */
  async sendPrompt(promptData: PromptData): Promise<LLMResponse> {
    return apiRequest<LLMResponse>('/api/llm/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(promptData),
    });
  },

  /**
   * Obtém o histórico de interações de um usuário com LLMs
   * @param userId ID do usuário
   * @param limit Limite de interações a retornar (opcional)
   * @returns Array de interações
   */
  async getUserInteractions(userId: string, limit: number = 50): Promise<any[]> {
    return apiRequest<any[]>(`/api/llm/interactions/user/${userId}?limit=${limit}`);
  },

  /**
   * Obtém uma interação específica pelo ID
   * @param id ID da interação
   * @returns Dados da interação
   */
  async getInteractionById(id: string): Promise<any> {
    return apiRequest<any>(`/api/llm/interactions/${id}`);
  },

  /**
   * Obtém a lista de provedores de LLM disponíveis
   * @returns Array de provedores
   */
  async getLLMProviders(): Promise<any[]> {
    return apiRequest<any[]>('/api/llm/providers');
  },

  /**
   * Obtém um provedor de LLM específico pelo ID
   * @param id ID do provedor
   * @returns Dados do provedor
   */
  async getLLMProviderById(id: string): Promise<any> {
    return apiRequest<any>(`/api/llm/providers/${id}`);
  },
  
  /**
   * Função de teste para chamar o modelo Gemma real
   * @param model Nome do modelo a ser testado
   * @param prompt Prompt de teste
   * @param userId ID do usuário
   * @param sessionToken Token de sessão para autenticação
   * @returns Resposta real do modelo
   */
  async testLLM(model: string, prompt: string, userId: string, sessionToken: string): Promise<LLMResponse> {
    console.log(`[LLM Service] Chamando modelo ${model} com prompt: ${prompt}`);
    
    try {
      // Chamar o backend para processar com o modelo real
      const response = await this.sendPrompt({
        userId: userId,
        sessionToken: sessionToken,
        prompt: prompt,
        model: model
      });
      
      console.log(`[LLM Service] Resposta recebida do ${model}:`, response.response);
      return response;
    } catch (error) {
      console.error(`[LLM Service] Erro ao chamar modelo ${model}:`, error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
};