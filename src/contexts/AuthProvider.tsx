
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
    }
    
    return {
      user: null,
      userRole: 'user' as UserRole,
      loading: true
    };
  };
  
  const initialState = loadInitialState();
  const [user, setUser] = useState<User | null>(initialState.user);
  const [userRole, setUserRole] = useState<UserRole>(initialState.userRole);
  const [loading, setLoading] = useState(initialState.loading);
  const [tenantId, setTenantId] = useState<string | null>('tenant-123'); // Mock tenant ID

  useEffect(() => {
    // If we already loaded from localStorage and have a user, skip the loading phase
    if (user) {
      setLoading(false);
      return;
    }

    // Create a mock user only if none was found in localStorage
    if (!user) {
      console.log('No user in storage, creating mock user');
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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
          user: mockUser, 
          userRole: 'admin' 
        }));
        console.log('Saved auth to storage after initialization');
      } catch (error) {
        console.error('Error saving auth to storage:', error);
      }
    }
    
    // Always make sure loading is set to false after initialization
    setLoading(false);
  }, []); // Empty dependency array ensures this only runs once on mount

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (!loading && user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, userRole }));
        console.log('Saved auth to storage after update:', { user, userRole });
      } catch (error) {
        console.error('Error saving auth to storage:', error);
      }
    }
  }, [user, userRole, loading]);

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
