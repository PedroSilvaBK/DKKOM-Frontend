// AuthContext.tsx
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize state from localStorage directly
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return { id: decodedToken.id, username: decodedToken.username, token };
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    return null;
  });

  const login = (token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      const loggedInUser = {
        id: decodedToken.id,
        username: decodedToken.username,
        token,
      };
      setUser(loggedInUser);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
