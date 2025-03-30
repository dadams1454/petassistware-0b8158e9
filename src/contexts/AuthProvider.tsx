
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>('tenant-123'); // Mock tenant ID

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
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setUser(mockUser);
      setUserRole('admin');
      setLoading(false);
      console.log('Auth loaded with mock user');
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate successful login
      setUser({
        id: '123',
        email,
        name: 'User Name',
        user_metadata: {
          avatarUrl: ''
        }
      });
      setUserRole('admin');
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
