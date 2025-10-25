/**
 * Funções utilitárias para processamento de respostas de LLMs
 */

/**
 * Extrai código de uma resposta do LLM
 * @param {string} text - Texto da resposta do LLM
 * @returns {Object} Objeto contendo o código e a linguagem
 */
export function extractCodeFromResponse(text) {
  // Procurar por blocos de código markdown
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
  const matches = [];
  let match;
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    matches.push({
      language: match[1] || 'text',
      code: match[2]
    });
  }
  
  return matches;
}

/**
 * Limpa uma resposta do LLM removendo formatações indesejadas
 * @param {string} text - Texto da resposta do LLM
 * @returns {string} Texto limpo
 */
export function cleanLLMResponse(text) {
  // Substituir asteriscos usados para negrito por pontos
  let cleaned = text.replace(/\*\*(.*?)\*\*/g, '$1.');
  
  // Substituir underscores usados para itálico por texto normal (sem formatação)
  cleaned = cleaned.replace(/__(.*?)__/g, '$1');
  cleaned = cleaned.replace(/_(.*?)_/g, '$1');
  
  // Remover crases usadas para código inline
  cleaned = cleaned.replace(/`(.*?)`/g, '$1');
  
  // Remover hashtags usadas para títulos
  cleaned = cleaned.replace(/^#+\s*(.*?)$/gm, '$1');
  
  // Garantir que não haja pontos duplicados
  cleaned = cleaned.replace(/\.{2,}/g, '.');
  
  // Remover espaços extras antes de pontos
  cleaned = cleaned.replace(/\s+\./g, '.');
  
  // Adicionar espaço após pontos, se não houver
  cleaned = cleaned.replace(/\.([A-Za-z])/g, '. $1');
  
  // Corrigir possíveis problemas com pontos no final
  cleaned = cleaned.replace(/\.{2,}/g, '.');
  
  // Garantir que o texto termine com ponto
  if (cleaned.length > 0 && !/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }
  
  return cleaned.trim();
}

/**
 * Formata uma resposta do LLM para exibição no chat
 * @param {string} text - Texto da resposta do LLM
 * @returns {string} Texto formatado
 */
export function formatLLMResponseForChat(text) {
  // Converter quebras de linha duplas em parágrafos
  let formatted = text.replace(/\n\n/g, '</p><p>');
  
  // Converter quebras de linha simples em <br>
  formatted = formatted.replace(/\n/g, '<br>');
  
  // Envolver em parágrafos se não estiverem presentes
  if (!formatted.startsWith('<p>')) {
    formatted = '<p>' + formatted + '</p>';
  }
  
  return formatted;
}

/**
 * Calcula o custo aproximado de uma interação com base nos tokens usados
 * @param {Object} usage - Objeto com estatísticas de uso de tokens
 * @param {string} model - Nome do modelo usado
 * @returns {Object} Objeto com custo estimado
 */
export function estimateCost(usage, model) {
  // Valores aproximados de custo por milhão de tokens (em USD)
  const costPerMillionTokens = {
    'gemini-1.5-flash': { input: 0.075, output: 0.30 },
    'gemini-1.5-pro': { input: 3.50, output: 10.50 },
    'default': { input: 0.10, output: 0.30 }
  };
  
  const modelCosts = costPerMillionTokens[model] || costPerMillionTokens['default'];
  
  const inputCost = (usage.promptTokens / 1000000) * modelCosts.input;
  const outputCost = (usage.completionTokens / 1000000) * modelCosts.output;
  const totalCost = inputCost + outputCost;
  
  return {
    inputCost: parseFloat(inputCost.toFixed(6)),
    outputCost: parseFloat(outputCost.toFixed(6)),
    totalCost: parseFloat(totalCost.toFixed(6)),
    currency: 'USD'
  };
}

/**
 * Valida se uma resposta do LLM é apropriada
 * @param {string} text - Texto da resposta do LLM
 * @returns {Object} Objeto com resultado da validação
 */
export function validateLLMResponse(text) {
  // Verificar se a resposta não está vazia
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      reason: 'Resposta vazia'
    };
  }
  
  // Verificar se a resposta contém palavras inadequadas (exemplo simples)
  const inappropriateWords = ['inadequado', 'ofensivo'];
  const containsInappropriate = inappropriateWords.some(word => 
    text.toLowerCase().includes(word.toLowerCase())
  );
  
  if (containsInappropriate) {
    return {
      isValid: false,
      reason: 'Conteúdo possivelmente inadequado'
    };
  }
  
  // Verificar se a resposta é muito longa (exemplo: mais de 10000 caracteres)
  if (text.length > 10000) {
    return {
      isValid: false,
      reason: 'Resposta muito longa'
    };
  }
  
  return {
    isValid: true,
    reason: 'Resposta válida'
  };
}

/**
 * Converte uma resposta do LLM em diferentes formatos
 * @param {string} text - Texto da resposta do LLM
 * @param {string} format - Formato desejado ('text', 'html', 'memory')
 * @returns {string} Texto convertido
 */
export function convertLLMResponse(text, format) {
  switch (format) {
    case 'html':
      return formatLLMResponseForChat(text);
    case 'memory':
      return text; // Já está em markdown
    case 'text':
    default:
      return cleanLLMResponse(text);
  }
}

export default {
  extractCodeFromResponse,
  cleanLLMResponse,
  formatLLMResponseForChat,
  estimateCost,
  validateLLMResponse,
  convertLLMResponse
};