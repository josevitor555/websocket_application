// Serviço de API para comunicação com o backend
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Interface para os dados do usuário
interface User {
  id: string;
  username: string;
  display_name: string;
  is_online: boolean;
  last_seen: string;
  created_at: string;
}

// Interface para os dados da sessão
interface Session {
  user: User;
  sessionToken: string;
}

// Interface para os dados de login
interface LoginData {
  username: string;
  displayName: string;
}

// Interface para os dados de logout
interface LogoutData {
  userId: string;
  sessionToken: string;
}

// Função para fazer requisições HTTP
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

// Serviço de autenticação
export const authService = {
  // Login de usuário
  async login(loginData: LoginData): Promise<Session> {
    return apiRequest<Session>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  },

  // Logout de usuário
  async logout(logoutData: LogoutData): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify(logoutData),
    });
  },
  
  // Verificação de sessão
  async verifySession(verifyData: { userId: string; sessionToken: string }): Promise<{ message: string; user: User }> {
    return apiRequest<{ message: string; user: User }>('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify(verifyData),
    });
  },
};

// Serviço de usuários
export const userService = {
  // Obter lista de usuários online
  async getOnlineUsers(): Promise<User[]> {
    return apiRequest<User[]>('/api/users/online');
  },

  // Obter usuário por ID
  async getUserById(id: string): Promise<User> {
    return apiRequest<User>(`/api/users/${id}`);
  },
};

// Serviço de mensagens
export const messageService = {
  // Obter histórico de mensagens
  async getHistory(limit: number = 100): Promise<any[]> {
    return apiRequest<any[]>(`/api/messages/history?limit=${limit}`);
  },

  // Criar nova mensagem
  async createMessage(messageData: { userId: string; message: string }): Promise<any> {
    return apiRequest<any>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
};

// Serviço de health check
export const healthService = {
  // Verificar status do servidor
  async checkHealth(): Promise<{ status: string; timestamp: string; message: string }> {
    return apiRequest<{ status: string; timestamp: string; message: string }>('/api/health');
  },
};