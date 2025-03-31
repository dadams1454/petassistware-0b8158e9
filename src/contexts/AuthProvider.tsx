
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define UserRole type and export it
export type UserRole = 'user' | 'staff' | 'manager' | 'admin' | 'owner';

interface User {
  id: string;
  email: string;
  name?: string;
  user_metadata?: {
    avatarUrl?: string;
  };
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  tenantId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Added alias for logout for compatibility
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: 'user',
  tenantId: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  signOut: async () => {}, // Added alias for logout for compatibility
  resetPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Store auth in localStorage to persist across page reloads
const STORAGE_KEY = 'breed_elite_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load initial state from localStorage
  const loadInitialState = () => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY);
      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth);
        console.log('Loaded auth from storage:', parsedAuth);
        return {
          user: parsedAuth.user,
          userRole: parsedAuth.userRole || 'user',
          loading: false
        };
      }
    } catch (error) {
      console.error('Error loading auth from storage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    
    return {
      user: null,
      userRole: 'user' as UserRole,
      loading: false // Changed to false to prevent initial loading state
    };
  };
  
  const initialState = loadInitialState();
  const [user, setUser] = useState<User | null>(initialState.user);
  const [userRole, setUserRole] = useState<UserRole>(initialState.userRole);
  const [loading, setLoading] = useState(initialState.loading);
  const [tenantId, setTenantId] = useState<string | null>('tenant-123'); // Mock tenant ID

  // Create a mock user and store it in localStorage immediately
  useEffect(() => {
    // If no user is found in storage, create a mock user
    if (!user) {
      console.log('Creating mock user and storing in localStorage');
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        user_metadata: {
          avatarUrl: ''
        }
      };
      
      setUser(mockUser);
      setUserRole('admin');
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        user: mockUser, 
        userRole: 'admin' 
      }));
    }
    
    // No need for a loading state in this simplified mock
    setLoading(false);
  }, [user]); 

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate successful login
      const mockUser = {
        id: '123',
        email,
        name: 'User Name',
        user_metadata: {
          avatarUrl: ''
        }
      };
      setUser(mockUser);
      setUserRole('admin');
      
      // Immediately save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        user: mockUser, 
        userRole: 'admin' 
      }));
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Simulate logout
      setUser(null);
      setUserRole('user');
      // Clear from localStorage
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add an alias for logout to maintain compatibility
  const signOut = logout;

  const resetPassword = async (email: string) => {
    try {
      // Simulate password reset
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    tenantId,
    loading,
    login,
    logout,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
