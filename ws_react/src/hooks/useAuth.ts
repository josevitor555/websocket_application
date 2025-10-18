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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar se há uma sessão armazenada no localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('chatUser');
    const storedToken = localStorage.getItem('sessionToken');
    
    if (storedUser && storedToken) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setSessionToken(storedToken);
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        localStorage.removeItem('chatUser');
        localStorage.removeItem('sessionToken');
      }
    }
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