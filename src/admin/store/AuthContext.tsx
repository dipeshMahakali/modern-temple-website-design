/**
 * Authentication Context & Provider
 * Manages JWT auth state, login/logout, token refresh
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setAccessToken } from '../../api/client';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  avatar_url?: string;
  last_login_at?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }, []);

  // On mount: single init check to prevent double execution
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      const hasSession = localStorage.getItem('remember_admin') === 'true' || path.startsWith('/admin');

      if (!hasSession) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const res = await api.post('/auth/refresh');
        if (isMounted) {
          setAccessToken(res.data.access_token);
          const userRes = await api.get('/auth/me');
          setUser(userRes.data);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          localStorage.removeItem('remember_admin');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    init();
    return () => { isMounted = false; };
  }, []);

  // Listen for forced logout events
  useEffect(() => {
    const handle = () => {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('remember_admin');
    };
    window.addEventListener('auth:logout', handle);
    return () => window.removeEventListener('auth:logout', handle);
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    const res = await api.post('/auth/login', { email, password, remember_me: rememberMe });
    setAccessToken(res.data.access_token);
    localStorage.setItem('remember_admin', 'true');
    await refreshUser();
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('remember_admin');
      setAccessToken(null);
      setUser(null);
    }
  };

  const logoutAll = async () => {
    try {
      await api.post('/auth/logout-all');
    } finally {
      localStorage.removeItem('remember_admin');
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, logoutAll, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
