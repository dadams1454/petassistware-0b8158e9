
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Users: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, loading, error, fetchUsers, userRole, signOutAllUsers, tenantId } = useUserManagement();
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

  const handleNavigateToAdmin = () => {
    navigate('/admin-setup');
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

  // Show loading state
  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Loading users..." />
      </PageContainer>
    );
  }

  const errorIsUuidFormat = error?.includes('invalid input syntax for type uuid');

  // If there's an error and it's related to UUID format
  if (error && errorIsUuidFormat) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <PageHeader 
            title="User Management" 
            description="Manage users and permissions for your organization"
          />
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertTitle>Configuration Issue</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>
                There is a configuration issue with your tenant ID. The current value
                {tenantId && <span className="font-mono mx-1 px-1 py-0.5 bg-gray-100 rounded">{tenantId}</span>}
                is not a valid UUID format required by the database.
              </p>
              <p>
                Please go to the Admin Setup page to configure your organization settings properly.
              </p>
              <Button 
                onClick={handleNavigateToAdmin}
                className="mt-2 flex items-center gap-2"
                variant="outline"
              >
                <Settings className="h-4 w-4" />
                Go to Admin Setup
              </Button>
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <UserTable 
              users={[]} 
              currentUserId={user?.id || ''}
              onEditUser={() => {}}
              onUserUpdated={() => {}}
            />
          </div>
        </div>
      </PageContainer>
    );
  }

  // Show generic error state
  if (error && !errorIsUuidFormat) {
    return (
      <PageContainer>
        <ErrorState 
          title="Could not load users" 
          message={error}
          onRetry={fetchUsers}
        />
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
