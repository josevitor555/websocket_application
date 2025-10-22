import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

class GeminiService {
  constructor() {
    // Inicializar o cliente do Google Generative AI
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY não está definida nas variáveis de ambiente');
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.defaultModel = 'gemma-3-1b-it';
  }

  /**
   * Verifica se a chave de API é válida
   * @returns {Promise<boolean>} True se a chave é válida, false caso contrário
   */
  async validateApiKey() {
    try {
      // Tentar obter informações sobre um modelo
      const model = this.genAI.getGenerativeModel({ model: this.defaultModel });
      // Se chegarmos até aqui sem erro, a chave é válida
      return true;
    } catch (error) {
      console.error('Erro ao validar chave de API:', error.message);
      return false;
    }
  }

  /**
   * Envia um prompt para o modelo Gemini e retorna a resposta
   * @param {string} prompt - O texto do prompt para enviar ao modelo
   * @param {Object} options - Opções adicionais para a chamada
   * @param {string} options.model - O modelo específico a ser usado (opcional)
   * @param {number} options.temperature - Temperatura para a geração (opcional)
   * @param {number} options.maxTokens - Número máximo de tokens na resposta (opcional)
   * @returns {Object} Objeto contendo a resposta e estatísticas de uso
   */
  async generateContent(prompt, options = {}) {
    try {
      const model = options.model || this.defaultModel;
      const temperature = options.temperature || 0.7;
      const maxTokens = options.maxTokens || 1000;

      // Obter o modelo
      const geminiModel = this.genAI.getGenerativeModel({ 
        model: model,
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens
        }
      });

      // Gerar conteúdo
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extrair estatísticas de uso
      const usageMetadata = response.usageMetadata || {};
      
      return {
        success: true,
        response: text,
        model: model,
        usage: {
          promptTokens: usageMetadata.promptTokenCount || 0,
          completionTokens: usageMetadata.candidatesTokenCount || 0,
          totalTokens: usageMetadata.totalTokenCount || 0
        }
      };
    } catch (error) {
      console.error('Erro ao gerar conteúdo com Gemini:', error);
      
      // Tratar erros específicos
      let errorMessage = error.message;
      if (error.status === 429) {
        errorMessage = 'Limite de uso da API excedido. Por favor, aguarde alguns minutos e tente novamente.';
      } else if (error.status === 404) {
        errorMessage = 'Modelo não encontrado. Por favor, verifique se o modelo está disponível.';
      }
      
      return {
        success: false,
        error: errorMessage,
        response: null
      };
    }
  }

  /**
   * Envia um prompt estruturado para o modelo Gemini
   * @param {Array} contents - Array de conteúdo estruturado
   * @param {Object} options - Opções adicionais para a chamada
   * @returns {Object} Objeto contendo a resposta e estatísticas de uso
   */
  async generateContentWithHistory(contents, options = {}) {
    try {
      const model = options.model || this.defaultModel;
      const temperature = options.temperature || 0.7;
      const maxTokens = options.maxTokens || 1000;

      // Obter o modelo
      const geminiModel = this.genAI.getGenerativeModel({ 
        model: model,
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens
        }
      });

      // Gerar conteúdo com histórico
      const result = await geminiModel.generateContent(contents);
      const response = await result.response;
      const text = response.text();
      
      // Extrair estatísticas de uso
      const usageMetadata = response.usageMetadata || {};
      
      return {
        success: true,
        response: text,
        model: model,
        usage: {
          promptTokens: usageMetadata.promptTokenCount || 0,
          completionTokens: usageMetadata.candidatesTokenCount || 0,
          totalTokens: usageMetadata.totalTokenCount || 0
        }
      };
    } catch (error) {
      console.error('Erro ao gerar conteúdo com histórico no Gemini:', error);
      return {
        success: false,
        error: error.message,
        response: null
      };
    }
  }

  /**
   * Lista os modelos disponíveis
   * @returns {Array} Array de modelos disponíveis
   */
  async listModels() {
    try {
      const result = await this.genAI.listModels();
      return {
        success: true,
        models: result.models
      };
    } catch (error) {
      console.error('Erro ao listar modelos do Gemini:', error);
      return {
        success: false,
        error: error.message,
        models: []
      };
    }
  }
}

// Exportar uma instância singleton do serviço
export default new GeminiService();