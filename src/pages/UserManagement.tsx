
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import { UserTable } from '@/components/user-management/UserTable';
import { InviteUserDialog } from '@/components/user-management/InviteUserDialog';
import { EditUserDialog } from '@/components/user-management/EditUserDialog';
import { UserManagementHeader } from '@/components/user-management/UserManagementHeader';
import { useUserManagement } from '@/hooks/user-management';
import { UserWithProfile } from '@/types/user';

const UserManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, loading, error, fetchUsers, userRole, signOutAllUsers } = useUserManagement();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  
  // Check if user has admin role
  React.useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/dashboard');
      toast({
        title: "Access Denied",
        description: "Only administrators can access the user management page.",
        variant: "destructive"
      });
    }
  }, [userRole, navigate, toast]);

  const handleOpenInvite = () => {
    setIsInviteOpen(true);
  };

  const handleCloseInvite = () => {
    setIsInviteOpen(false);
  };

  const handleEditUser = (user: UserWithProfile) => {
    setSelectedUser(user);
  };

  const handleCloseEdit = () => {
    setSelectedUser(null);
  };

  // Show loading or error states
  if (loading) {
    return <LoadingState message="Loading users..." />;
  }

  if (error) {
    return <ErrorState title="Could not load users" message={error} />;
  }

  return (
    <div className="container mx-auto py-8">
      <UserManagementHeader 
        onOpenInvite={handleOpenInvite} 
        onSignOutAllUsers={signOutAllUsers}
      />
      
      <div className="mt-6">
        <UserTable 
          users={users} 
          currentUserId={user?.id || ''}
          onEditUser={handleEditUser}
          onUserUpdated={fetchUsers}
        />
      </div>

      <InviteUserDialog 
        open={isInviteOpen} 
        onClose={handleCloseInvite}
        onUserInvited={fetchUsers}
      />

      {selectedUser && (
        <EditUserDialog
          open={!!selectedUser}
          onClose={handleCloseEdit}
          user={selectedUser}
          currentUserId={user?.id || ''}
          onUserUpdated={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserManagement;
