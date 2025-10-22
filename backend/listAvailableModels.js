// Este script tentará descobrir quais modelos estão disponíveis
// Fazendo uma chamada direta à API do Google Generative AI

import dotenv from 'dotenv';
import https from 'https';

// Carregar variáveis de ambiente
dotenv.config();

function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY não está definida nas variáveis de ambiente');
    return;
  }

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: '/v1beta/models?key=' + apiKey,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('Modelos disponíveis:');
        
        if (response.models && Array.isArray(response.models)) {
          response.models.forEach(model => {
            console.log(`\n- Nome: ${model.name}`);
            console.log(`  Display Name: ${model.displayName || 'N/A'}`);
            console.log(`  Description: ${model.description || 'N/A'}`);
            
            if (model.supportedGenerationMethods) {
              console.log(`  Métodos suportados: ${model.supportedGenerationMethods.join(', ')}`);
            }
            
            // Verificar se suporta generateContent
            if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes('generateContent')) {
              console.log(`  ✅ Suporta geração de conteúdo`);
            } else {
              console.log(`  ❌ Não suporta geração de conteúdo`);
            }
          });
        } else {
          console.log('Resposta inesperada:', response);
        }
      } catch (error) {
        console.error('Erro ao parsear resposta:', error);
        console.log('Dados brutos:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Erro na requisição:', error);
  });

  req.end();
}

listModels();