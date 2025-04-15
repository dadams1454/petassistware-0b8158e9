
import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Define mock user type
export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'breeder' | 'staff' | 'guest';
  photoURL?: string;
}

// Define auth context type
export interface AuthContextType {
  user: MockUser | null;
  userRole: string;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: '',
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
});

// Mock user data
const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    photoURL: 'https://via.placeholder.com/150'
  },
  {
    id: '2',
    name: 'Breeder User',
    email: 'breeder@example.com',
    role: 'breeder',
    photoURL: 'https://via.placeholder.com/150'
  },
  {
    id: '3',
    name: 'Staff Member',
    email: 'staff@example.com',
    role: 'staff',
  }
];

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('paw_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user by email (password is ignored in mock)
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('paw_user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('paw_user');
  };

  // Get user role
  const userRole = user?.role || '';

  return (
    <AuthContext.Provider value={{ user, userRole, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
