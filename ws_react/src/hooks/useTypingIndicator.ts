import { useState, useRef, useCallback, useEffect } from 'react';

interface TypingIndicatorHook {
  typingUser: string | null;
  setTypingUser: (username: string | null) => void;
  startTypingIndicator: (username: string) => void;
  clearTypingIndicator: () => void;
}

export function useTypingIndicator(timeoutMs: number = 3000): TypingIndicatorHook {
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const clearTypingIndicator = useCallback(() => {
    setTypingUser(null);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  const startTypingIndicator = useCallback((username: string) => {
    // Limpar o timeout anterior se existir
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Definir o usuário que está digitando
    setTypingUser(username);
    
    // Definir um novo timeout para limpar o indicador
    typingTimeoutRef.current = window.setTimeout(() => {
      setTypingUser(null);
      typingTimeoutRef.current = null;
    }, timeoutMs);
  }, [timeoutMs]);

  // Limpar o timeout quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    typingUser,
    setTypingUser,
    startTypingIndicator,
    clearTypingIndicator
  };
}