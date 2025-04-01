
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define UserRole type that's needed across the app
export type UserRole = 'guest' | 'user' | 'staff' | 'manager' | 'admin' | 'owner' | 'veterinarian' | 'buyer';

// Define AuthContextType
export type AuthContextType = {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signOut: () => Promise<void>; // Alias for logout but as a Promise
  loading: boolean;
  error: string | null;
  userRole: UserRole | null;
  tenantId: string | null;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
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
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);

  // Check for existing user session on load
  useEffect(() => {
    // Simulate loading existing user from localStorage or cookies
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Set the user role from the stored user data
          setUserRole(parsedUser.role as UserRole || 'user');
          
          // Set tenant ID from the stored user data
          setTenantId(parsedUser.tenantId || '00000000-0000-0000-0000-000000000000');
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

    try {
      // Mock API call - replace with actual authentication logic
      if (email && password) {
        // Simulate a successful login
        const mockUser = { 
          id: '1', 
          email, 
          name: 'Demo User', 
          role: 'admin' as UserRole,
          tenantId: '00000000-0000-0000-0000-000000000000'
        };
        
        // Store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setUserRole(mockUser.role);
        setTenantId(mockUser.tenantId);
      } else {
        throw new Error('Email and password are required');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    setUser(null);
    setUserRole(null);
    setTenantId(null);
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
