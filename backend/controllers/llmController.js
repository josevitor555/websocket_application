import { LLMProvider, LLMInteraction } from '../model/index.js';
import geminiService from '../services/geminiService.js';
import { HTTP_STATUS, MESSAGES } from '../constant.js';
import { validateLLMResponse, estimateCost, convertLLMResponse } from '../utils/llmUtils.js';

class LLMController {
  /**
   * Obtém a lista de provedores de LLM disponíveis
   */
  static async getLLMProviders(req, res) {
    try {
      const providers = await LLMProvider.getAll();
      res.status(HTTP_STATUS.OK).json(providers);
    } catch (error) {
      console.error('Error fetching LLM providers:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }

  /**
   * Obtém um provedor de LLM específico pelo ID
   */
  static async getLLMProviderById(req, res) {
    try {
      const { id } = req.params;
      const provider = await LLMProvider.findById(id);

      if (!provider) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ 
          error: 'LLM provider not found' 
        });
      }

      res.status(HTTP_STATUS.OK).json(provider);
    } catch (error) {
      console.error('Error fetching LLM provider:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }

  /**
   * Envia um prompt para um LLM e retorna a resposta
   */
  static async sendPrompt(req, res) {
    try {
      const { userId, prompt, providerId, model, options = {} } = req.body;

      // Validação dos campos obrigatórios
      if (!userId || !prompt) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: MESSAGES.MISSING_FIELDS 
        });
      }

      // Verificar se o provedor existe
      let provider;
      if (providerId) {
        provider = await LLMProvider.findById(providerId);
        if (!provider) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({ 
            error: 'LLM provider not found' 
          });
        }
      } else {
        // Usar o provedor padrão (Gemini)
        provider = await LLMProvider.findByName('gemini');
        if (!provider) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({ 
            error: 'Default LLM provider (Gemini) not found' 
          });
        }
      }

      // Verificar se o provedor está ativo
      if (!provider.is_active) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: 'LLM provider is not active' 
        });
      }

      // Chamar o serviço apropriado com base no provedor
      let llmResponse;
      if (provider.name.toLowerCase().includes('gemini')) {
        llmResponse = await geminiService.generateContent(prompt, { model, ...options });
      } else {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: `Unsupported LLM provider: ${provider.name}` 
        });
      }

      // Verificar se a chamada foi bem-sucedida
      if (!llmResponse.success) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
          error: `LLM call failed: ${llmResponse.error}` 
        });
      }

      // Validar a resposta do LLM
      const validation = validateLLMResponse(llmResponse.response);
      if (!validation.isValid) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
          error: `Invalid LLM response: ${validation.reason}` 
        });
      }

      // Converter a resposta para o formato de texto simples
      const cleanResponse = convertLLMResponse(llmResponse.response, 'text');

      // Estimar o custo da interação
      const cost = estimateCost(llmResponse.usage, llmResponse.model);

      // Salvar a interação no banco de dados
      const interaction = await LLMInteraction.create({
        user_id: userId,
        provider_id: provider.id,
        prompt: prompt,
        response: cleanResponse,
        model: llmResponse.model,
        tokens_used: llmResponse.usage.totalTokens
      });

      // Retornar a resposta
      res.status(HTTP_STATUS.OK).json({
        success: true,
        response: cleanResponse,
        interactionId: interaction.id,
        usage: llmResponse.usage,
        cost: cost,
        provider: {
          id: provider.id,
          name: provider.name
        }
      });
    } catch (error) {
      console.error('Error processing LLM prompt:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }

  /**
   * Obtém o histórico de interações de um usuário com LLMs
   */
  static async getUserInteractions(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 50 } = req.query;

      if (!userId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: MESSAGES.MISSING_FIELDS 
        });
      }

      const interactions = await LLMInteraction.findByUserId(userId, parseInt(limit));
      res.status(HTTP_STATUS.OK).json(interactions);
    } catch (error) {
      console.error('Error fetching user LLM interactions:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }

  /**
   * Obtém uma interação específica pelo ID
   */
  static async getInteractionById(req, res) {
    try {
      const { id } = req.params;
      const interaction = await LLMInteraction.findById(id);

      if (!interaction) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ 
          error: 'LLM interaction not found' 
        });
      }

      res.status(HTTP_STATUS.OK).json(interaction);
    } catch (error) {
      console.error('Error fetching LLM interaction:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: MESSAGES.INTERNAL_ERROR 
      });
    }
  }
}

export default LLMController;