
import React, { createContext, useContext, useState, useEffect } from 'react';

// Simple mock user interface
export interface MockUser {
  id: string;
  email: string;
  name: string;
  photoURL?: string; // Added to fix UserMenu.tsx error
  role: 'admin' | 'manager' | 'staff' | 'viewer';
}

// Test users for development
const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    photoURL: 'https://randomuser.me/api/portraits/women/43.jpg',
    role: 'admin'
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'manager'
  },
  {
    id: '3',
    email: 'staff@example.com',
    name: 'Staff User',
    photoURL: 'https://randomuser.me/api/portraits/women/56.jpg',
    role: 'staff'
  }
];

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user in localStorage on mount
  useEffect(() => {
    const checkStoredUser = () => {
      const storedUser = localStorage.getItem('paw_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
          localStorage.removeItem('paw_user');
        }
      }
      setLoading(false);
    };

    checkStoredUser();
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find matching user
      const matchedUser = MOCK_USERS.find(u => u.email === email);
      
      if (matchedUser && password === 'password') {
        // Store user in state and localStorage
        setUser(matchedUser);
        localStorage.setItem('paw_user', JSON.stringify(matchedUser));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('paw_user');
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
