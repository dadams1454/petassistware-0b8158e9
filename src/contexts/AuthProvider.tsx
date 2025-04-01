
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define AuthContextType
export type AuthContextType = {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: false,
  error: null,
});

// Export the useAuth hook for convenience
export const useAuth = () => useContext(AuthContext);

// Create the provider component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user session on load
  useEffect(() => {
    // Simulate loading existing user from localStorage or cookies
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
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
        const mockUser = { id: '1', email, name: 'Demo User', role: 'admin' };
        
        // Store user in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
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
  };

  // Provide the auth context to child components
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
