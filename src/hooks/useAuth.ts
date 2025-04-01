
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthProvider';

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};

export default useAuth;
