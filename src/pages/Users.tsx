
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader, LoadingState, ErrorState, UnauthorizedState } from '@/components/ui/standardized';
import { UserTable } from '@/components/user-management/UserTable';
import { InviteUserDialog } from '@/components/user-management/InviteUserDialog';
import { EditUserDialog } from '@/components/user-management/EditUserDialog';
import { UserManagementHeader } from '@/components/user-management/UserManagementHeader';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserWithProfile } from '@/types/user';

const Users: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, loading, error, fetchUsers, userRole, signOutAllUsers } = useUserManagement();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  
  // Check if user has admin role
  const isAdmin = userRole === 'admin';

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

  // Show unauthorized state if not admin
  if (!isAdmin) {
    return (
      <PageContainer>
        <UnauthorizedState 
          title="Access Denied" 
          description="Only administrators can access user management"
          backPath="/dashboard"
        />
      </PageContainer>
    );
  }

  // Show loading or error states
  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Loading users..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState title="Could not load users" message={error} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
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
    </PageContainer>
  );
};

export default Users;
