'use client';

import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { AuthenticationResponse, User, AuthenticationInput } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: AuthenticationInput) => Promise<void>;
  logout: () => void;
  updateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getUser();
      if (storedUser) {
        setUser(storedUser);
        // Verifica se o token ainda é válido
        try {
          const currentUser = await userService.getMe();
          setUser(currentUser);
        } catch (error) {
          // Token inválido, limpa o storage
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: AuthenticationInput) => {
    try {
      const response = await authService.login(data);
      setUser(response);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = async () => {
    try {
      const currentUser = await userService.getMe();
      setUser(currentUser);
      // Atualiza também no localStorage
      if (typeof window !== 'undefined') {
        const token = authService.getToken();
        if (token) {
          localStorage.setItem('user', JSON.stringify({ ...currentUser, token }));
        }
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

