import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

async function testModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY não está definida nas variáveis de ambiente');
      return;
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Lista de modelos para testar
    const modelsToTest = [
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-001',
      'gemini-1.0-pro-001'
    ];
    
    console.log('Testando diferentes modelos do Google Gemini...\n');
    
    for (const modelName of modelsToTest) {
      try {
        console.log(`Testando modelo: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Tentar gerar um conteúdo simples
        const result = await model.generateContent('Olá, responda com apenas uma palavra: OK');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✓ Modelo ${modelName} está funcionando: ${text.trim()}`);
        console.log('---');
        // Se encontrarmos um modelo que funciona, podemos parar
        break;
      } catch (error) {
        console.log(`✗ Modelo ${modelName} falhou: ${error.message.split('.')[0]}`);
      }
    }
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

testModels();