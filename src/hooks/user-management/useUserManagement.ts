
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useFetchUsers } from './useFetchUsers';
import { useAuthActions } from './authActions';

export const useUserManagement = () => {
  const { userRole, tenantId, user } = useAuth();
  const { users, loading, error, fetchUsers } = useFetchUsers(tenantId, user);
  const { signOutAllUsers } = useAuthActions();

  useEffect(() => {
    if (tenantId) {
      fetchUsers();
    }
  }, [tenantId]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    userRole,
    signOutAllUsers,
    tenantId // Expose tenantId for error messages
  };
};
