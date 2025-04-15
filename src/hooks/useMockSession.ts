
import { useState, useEffect } from 'react';
import { mockUsers } from '@/mockData/users';

export type UserRole = 'admin' | 'manager' | 'staff' | 'veterinarian' | 'breeder' | 'viewer';

export interface MockSessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImageUrl?: string;
}

interface MockSessionResult {
  user: MockSessionUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setActiveRole: (role: UserRole) => void;
}

/**
 * Hook that provides mock user session functionality
 * This simulates authentication without requiring an actual backend
 */
export const useMockSession = (): MockSessionResult => {
  const [user, setUser] = useState<MockSessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for stored session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mock_session_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('mock_session_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user by email (password is ignored in mock)
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        const sessionUser: MockSessionUser = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role as UserRole,
          profileImageUrl: foundUser.profileImageUrl
        };
        
        setUser(sessionUser);
        localStorage.setItem('mock_session_user', JSON.stringify(sessionUser));
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_session_user');
  };

  const setActiveRole = (role: UserRole) => {
    if (!user) return;
    
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    localStorage.setItem('mock_session_user', JSON.stringify(updatedUser));
    console.log(`Role changed to: ${role}`);
  };

  return { user, loading, error, login, logout, setActiveRole };
};

export default useMockSession;
