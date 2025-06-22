import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../data/types';
import api, { authApi } from '../apiConfig/Bus';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from storage
  const initializeAuth = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('busBookingUser');
      
      if (accessToken && savedUser) {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await authApi.login({ email, password });
      
      const userToStore: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone
      };
      
      localStorage.setItem('busBookingUser', JSON.stringify(userToStore));
      setUser(userToStore);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register({
        fullName: name,
        email,
        password,
        phoneNumber: phone
      });

      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

// In AuthProvider
const logout = useCallback(async () => {
  try {
    await api.post('/auth-user/logout'); 
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('busBookingUser');
    setUser(null);
    setError(null);
  }
}, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};