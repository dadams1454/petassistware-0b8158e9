
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
const TENANT_ID_KEY = 'breed_elite_tenant_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load initial state from localStorage
  const loadInitialState = () => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY);
      const savedTenantId = localStorage.getItem(TENANT_ID_KEY);
      
      let validTenantId = savedTenantId;
      
      // Check if tenantId is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!savedTenantId || !uuidRegex.test(savedTenantId)) {
        // Generate a new valid UUID if none exists or it's invalid
        validTenantId = uuidv4();
        localStorage.setItem(TENANT_ID_KEY, validTenantId);
        console.log('Generated new tenant ID:', validTenantId);
      }
      
      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth);
        console.log('Loaded auth from storage:', parsedAuth);
        return {
          user: parsedAuth.user,
          userRole: parsedAuth.userRole || 'user',
          tenantId: validTenantId,
          loading: false
        };
      }
    } catch (error) {
      console.error('Error loading auth from storage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    
    // Generate a valid UUID for tenant ID
    const newTenantId = uuidv4();
    localStorage.setItem(TENANT_ID_KEY, newTenantId);
    console.log('Created new tenant ID:', newTenantId);
    
    return {
      user: null,
      userRole: 'user' as UserRole,
      tenantId: newTenantId,
      loading: false // Changed to false to prevent initial loading state
    };
  };
  
  const initialState = loadInitialState();
  const [user, setUser] = useState<User | null>(initialState.user);
  const [userRole, setUserRole] = useState<UserRole>(initialState.userRole);
  const [loading, setLoading] = useState(initialState.loading);
  
  // Use the valid UUID from initialState for the tenant ID
  const [tenantId, setTenantId] = useState<string | null>(initialState.tenantId);

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
