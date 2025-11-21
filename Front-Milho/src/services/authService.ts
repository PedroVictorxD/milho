import { apiClient } from '@/utils/api';
import { AuthenticationInput, AuthenticationResponse } from '@/types';

export const authService = {
  async login(data: AuthenticationInput): Promise<AuthenticationResponse> {
    const response = await apiClient.post<AuthenticationResponse>('/auth/login', data);
    
    
    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    
    return response;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  getUser(): AuthenticationResponse | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },
};

