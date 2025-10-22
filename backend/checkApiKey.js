import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

console.log('Verificando chave de API do Gemini...');
console.log('Chave de API definida:', !!process.env.GEMINI_API_KEY);
console.log('Valor da chave (primeiros 10 caracteres):', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');