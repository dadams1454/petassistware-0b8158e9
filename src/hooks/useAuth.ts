
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthProvider';

/**
 * Hook to access authentication context throughout the application
 * @returns Authentication context with user data, auth state and methods
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
