import * as tokenUtils from './tokenUtils.js';
import * as validationUtils from './validationUtils.js';

// Exportar todas as funções de tokenUtils
export const { generateSessionToken, validateSessionToken } = tokenUtils;

// Exportar todas as funções de validationUtils
export const { validateUser, validateMessage } = validationUtils;