import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../lib/api';
import type { ChatUser } from '../../types/chat';

interface UseAuthReturn {
  currentUser: ChatUser | null;
  sessionToken: string | null;
  login: (username: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Inicia como true para indicar que está carregando
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar se há uma sessão armazenada no localStorage
  useEffect(() => {
    // Simular um pequeno delay para garantir que o loading seja visível
    const timer = setTimeout(async () => {
      const storedUser = localStorage.getItem('chatUser');
      const storedToken = localStorage.getItem('sessionToken');
      
      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          
          // Verificar se a sessão ainda é válida no backend
          try {
            const response = await authService.verifySession({
              userId: user.id,
              sessionToken: storedToken
            });
            
            // Sessão válida, atualizar dados do usuário
            setCurrentUser(response.user);
            setSessionToken(storedToken);
            
            // Atualizar localStorage com dados atualizados
            localStorage.setItem('chatUser', JSON.stringify(response.user));
          } catch (err) {
            console.error('Session verification failed:', err);
            // Sessão inválida, limpar dados
            localStorage.removeItem('chatUser');
            localStorage.removeItem('sessionToken');
          }
        } catch (err) {
          console.error('Error parsing or verifying stored user data:', err);
          localStorage.removeItem('chatUser');
          localStorage.removeItem('sessionToken');
        }
      }
      // Finaliza o carregamento após verificar o localStorage
      setLoading(false);
    }, 100); // Pequeno delay para garantir visibilidade do loading

    return () => clearTimeout(timer);
  }, []);

  const login = async (username: string, displayName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const session = await authService.login({
        username,
        displayName
      });
      
      setCurrentUser(session.user);
      setSessionToken(session.sessionToken);
      
      // Armazenar no localStorage
      localStorage.setItem('chatUser', JSON.stringify(session.user));
      localStorage.setItem('sessionToken', session.sessionToken);
      
      // Redirecionar para a página principal após o login
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Falha ao realizar login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (currentUser && sessionToken) {
      try {
        await authService.logout({
          userId: currentUser.id,
          sessionToken
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    
    setCurrentUser(null);
    setSessionToken(null);
    
    // Remover do localStorage
    localStorage.removeItem('chatUser');
    localStorage.removeItem('sessionToken');
    
    // Redirecionar para a página de login após o logout
    navigate('/login');
  };

  return {
    currentUser,
    sessionToken,
    login,
    logout,
    loading,
    error
  };
}