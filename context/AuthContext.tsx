import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VALID_EMAIL = 'usuario@nasa.com';
const VALID_PASSWORD = '123456';
const SESSION_KEY = '@nasa_skyalert_session';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await AsyncStorage.getItem(SESSION_KEY);
        if (session === 'active') {
          setIsAuthenticated(true);
        }
      } catch {
        // no saved session, that's fine
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      return { success: false, error: 'invalid_credentials' };
    }

    if (rememberMe) {
      try {
        await AsyncStorage.setItem(SESSION_KEY, 'active');
      } catch {
        // session works but won't persist
      }
    }

    setIsAuthenticated(true);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch {
      // continue with logout regardless
    }

    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
}
