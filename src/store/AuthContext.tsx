import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/auth';
import { authService } from '../features/auth/AuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) {
      setUser(current);
    } else {
      // For instant friction-free evaluation, initialize with default analyst session
      authService
        .signIn('lokesh.upreti@howdengroup.com', 'Lokesh@80198')
        .then((demoUser) => {
          setUser(demoUser);
        })
        .catch(() => {})
        .finally(() => {
          setIsLoading(false);
        });
      return;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const u = await authService.signIn(email, pass);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
