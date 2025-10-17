// Constantes da aplicação

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export const MESSAGES = {
  SUCCESS: 'Operação realizada com sucesso',
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  USER_NOT_FOUND: 'Usuário não encontrado',
  USER_ALREADY_EXISTS: 'Usuário já existe',
  MISSING_FIELDS: 'Campos obrigatórios não informados',
  DATABASE_ERROR: 'Erro ao acessar o banco de dados',
  AUTHENTICATION_ERROR: 'Erro de autenticação',
  AUTHORIZATION_ERROR: 'Erro de autorização',
  VALIDATION_ERROR: 'Erro de validação',
  INTERNAL_ERROR: 'Erro interno do servidor'
};

export const DEFAULTS = {
  MESSAGE_LIMIT: 100,
  SESSION_TIMEOUT: 3600000 // 1 hora em milissegundos
};

export const SOCKET_EVENTS = {
  // Eventos recebidos
  AUTHENTICATE: 'authenticate',
  SEND_MESSAGE: 'send_message',
  TYPING: 'typing',
  
  // Eventos emitidos
  AUTHENTICATED: 'authenticated',
  AUTH_ERROR: 'auth_error',
  USERS_UPDATED: 'users_updated',
  NEW_MESSAGE: 'new_message',
  USER_TYPING: 'user_typing',
  MESSAGE_ERROR: 'message_error'
};