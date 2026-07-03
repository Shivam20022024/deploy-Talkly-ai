'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
  company_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (companyName: string, name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('talkly_user');
    let token = localStorage.getItem('talkly_user_token');
    
    // Auto-recover from corrupted state
    if (token === 'undefined' || savedUser === 'undefined') {
      localStorage.removeItem('talkly_user');
      localStorage.removeItem('talkly_user_token');
      document.cookie = 'talkly_token=; path=/; max-age=0; samesite=lax';
      window.location.href = '/login';
      return;
    }
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        document.cookie = `talkly_token=${token}; path=/; max-age=604800; samesite=lax`;
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const response = await api.login(email, pass);
    const userData = response.user;
    const token = response.access_token;
    
    setUser(userData);
    localStorage.setItem('talkly_user', JSON.stringify(userData));
    localStorage.setItem('talkly_user_token', token);
    document.cookie = `talkly_token=${token}; path=/; max-age=604800; samesite=lax`;
  };

  const register = async (companyName: string, name: string, email: string, pass: string) => {
    const response = await api.register(companyName, name, email, pass);
    const userData = response.user;
    const token = response.access_token;
    
    setUser(userData);
    localStorage.setItem('talkly_user', JSON.stringify(userData));
    localStorage.setItem('talkly_user_token', token);
    document.cookie = `talkly_token=${token}; path=/; max-age=604800; samesite=lax`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('talkly_user');
    localStorage.removeItem('talkly_user_token');
    document.cookie = 'talkly_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
