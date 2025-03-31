
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
  
  const [user, setUser] = useState<User | null>(loadInitialState().user);
  const [userRole, setUserRole] = useState<UserRole>(loadInitialState().userRole);
  const [loading, setLoading] = useState(loadInitialState().loading);
  const [tenantId, setTenantId] = useState<string | null>('tenant-123'); // Mock tenant ID
  const [authInitialized, setAuthInitialized] = useState(false);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (!loading && authInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, userRole }));
        console.log('Saved auth to storage:', { user, userRole });
      } catch (error) {
        console.error('Error saving auth to storage:', error);
      }
    }
  }, [user, userRole, loading, authInitialized]);

  useEffect(() => {
    // Create a mock user for development purposes
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      user_metadata: {
        avatarUrl: ''
      }
    };
    
    // Check if we already have a user loaded from storage
    if (!user) {
      // Simulate loading delay only if no user is in storage
      const timer = setTimeout(() => {
        setUser(mockUser);
        setUserRole('admin');
        setLoading(false);
        setAuthInitialized(true);
        console.log('Auth loaded with mock user');
      }, 100); // Reduced to 100ms for faster initialization
      
      return () => clearTimeout(timer);
    } else {
      // If we have a user from storage, just make sure loading is false
      setLoading(false);
      setAuthInitialized(true);
    }
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
      setAuthInitialized(true);
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
