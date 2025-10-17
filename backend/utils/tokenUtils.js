import crypto from 'crypto';

// Gerar token de sessão
function generateSessionToken(userId) {
  return `${userId}_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
}

// Validar formato do token
function validateSessionToken(token) {
  // Verificar se o token tem o formato esperado
  const tokenRegex = /^[a-f0-9-]+_\d+_[a-f0-9]{32}$/;
  return tokenRegex.test(token);
}

export {
  generateSessionToken,
  validateSessionToken
};