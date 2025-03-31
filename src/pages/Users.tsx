
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
import { AlertTriangle, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isValidUUID } from '@/utils/uuidUtils';

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

  const handleRefreshUsers = () => {
    fetchUsers();
    toast({
      title: "Refreshing data",
      description: "Attempting to reload user data",
    });
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

  const isUuidFormatError = error?.includes('invalid input syntax for type uuid') || 
                          (tenantId && !isValidUUID(tenantId));

  // If there's an error and it's related to UUID format
  if (error && isUuidFormatError) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <PageHeader 
            title="User Management" 
            description="Manage users and permissions for your organization"
          />
          <Alert variant="destructive" className="mb-6 border-l-4 border-red-500 bg-red-50">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <AlertTitle className="text-red-800 font-medium">UUID Format Error</AlertTitle>
                <AlertDescription className="text-red-700 mt-2 space-y-4">
                  <p>
                    There is a configuration issue with your tenant ID. 
                    {tenantId && (
                      <span> The current value <code className="mx-1 px-2 py-0.5 bg-red-100 font-mono rounded">{tenantId}</code> is not a valid UUID format.</span>
                    )}
                  </p>
                  <p>
                    A valid UUID should follow this format: <code className="px-2 py-0.5 bg-red-100 font-mono rounded">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>
                  </p>
                  <p>
                    Please go to the Admin Setup page to generate a proper UUID for your organization.
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Button 
                      onClick={handleNavigateToAdmin}
                      className="flex items-center gap-2"
                      variant="default"
                    >
                      <Settings className="h-4 w-4" />
                      Go to Admin Setup
                    </Button>
                    <Button 
                      onClick={handleRefreshUsers}
                      className="flex items-center gap-2"
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh Data
                    </Button>
                  </div>
                </AlertDescription>
              </div>
            </div>
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
  if (error && !isUuidFormatError) {
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
