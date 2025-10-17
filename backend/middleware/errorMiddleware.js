import { HTTP_STATUS, MESSAGES } from '../constant.js';

// Middleware para tratamento de erros
function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);

  // Erros de validação do Joi (se estiver usando)
  if (err.isJoi) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: MESSAGES.VALIDATION_ERROR,
      details: err.details
    });
  }

  // Erros de autenticação
  if (err.name === 'UnauthorizedError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: MESSAGES.AUTHENTICATION_ERROR
    });
  }

  // Erro padrão
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: MESSAGES.INTERNAL_ERROR
  });
}

// Middleware para rotas não encontradas
function notFoundHandler(req, res, next) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: 'Rota não encontrada'
  });
}

export {
  errorHandler,
  notFoundHandler
};