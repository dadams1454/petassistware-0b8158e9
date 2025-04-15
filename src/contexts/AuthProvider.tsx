
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, findUserByEmail, MockUser } from '@/mockData/users';

// Define UserRole type that's needed across the app
export type UserRole = 'guest' | 'user' | 'staff' | 'manager' | 'admin' | 'owner' | 'veterinarian' | 'buyer' | 'viewer';

// Define AuthContextType
export type AuthContextType = {
  user: MockUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signOut: () => Promise<void>; // Alias for logout but as a Promise
  loading: boolean;
  error: string | null;
  userRole: UserRole | null;
  tenantId: string | null;
};

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  signOut: async () => {},
  loading: false,
  error: null,
  userRole: null,
  tenantId: null,
});

// Export the useAuth hook for convenience
export const useAuth = () => useContext(AuthContext);

// Create the provider component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);

  // Check for existing user session on load
  useEffect(() => {
    // Check localStorage for existing user
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        console.log('AuthProvider: Checking for stored user:', !!storedUser);
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Set the user role from the stored user data
          setUserRole(parsedUser.role as UserRole || 'user');
          
          // Set tenant ID from the stored user data
          setTenantId(parsedUser.tenantId || '00000000-0000-0000-0000-000000000000');
          
          console.log('AuthProvider: User restored from storage');
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    console.log('AuthProvider: Login attempt with email', email);

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!email) {
        throw new Error('Email is required');
      }
      
      if (!password) {
        throw new Error('Password is required');
      }
      
      // Find user from mock data
      const foundUser = findUserByEmail(email);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, we would check password here
      // For this mock version, any password works for testing

      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(foundUser));
      
      setUser(foundUser);
      setUserRole(foundUser.role);
      setTenantId(foundUser.tenantId);
      console.log('AuthProvider: Login successful, user set');
    } catch (err: any) {
      console.error('AuthProvider: Login error', err);
      setError(err.message || 'Failed to authenticate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('AuthProvider: Logging out');
    // Remove user from localStorage
    localStorage.removeItem('user');
    setUser(null);
    setUserRole(null);
    setTenantId(null);
    console.log('AuthProvider: User logged out, state cleared');
  };

  // SignOut function (Promise-based alias for logout)
  const signOut = async () => {
    return new Promise<void>((resolve) => {
      logout();
      resolve();
    });
  };

  // Provide the auth context to child components
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      signOut,
      loading, 
      error,
      userRole,
      tenantId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
