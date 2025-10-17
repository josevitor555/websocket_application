// Validar dados do usuário
function validateUser(userData) {
  const errors = [];

  if (!userData.username || userData.username.trim().length === 0) {
    errors.push('Username é obrigatório');
  }

  if (!userData.displayName || userData.displayName.trim().length === 0) {
    errors.push('Display name é obrigatório');
  }

  if (userData.username && userData.username.length > 50) {
    errors.push('Username não pode ter mais de 50 caracteres');
  }

  if (userData.displayName && userData.displayName.length > 100) {
    errors.push('Display name não pode ter mais de 100 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validar mensagem
function validateMessage(messageData) {
  const errors = [];

  if (!messageData.userId) {
    errors.push('User ID é obrigatório');
  }

  if (!messageData.message || messageData.message.trim().length === 0) {
    errors.push('Mensagem é obrigatória');
  }

  if (messageData.message && messageData.message.length > 1000) {
    errors.push('Mensagem não pode ter mais de 1000 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export {
  validateUser,
  validateMessage
};