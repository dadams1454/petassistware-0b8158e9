
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import { UserTable } from '@/components/user-management/UserTable';
import { InviteUserDialog } from '@/components/user-management/InviteUserDialog';
import { EditUserDialog } from '@/components/user-management/EditUserDialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

export type UserWithProfile = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  role: string | null;
  tenant_id: string | null;
};

const UserManagement = () => {
  const { user, userRole, tenantId } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  
  // Check if user has admin role
  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/dashboard');
      toast({
        title: "Access Denied",
        description: "Only administrators can access the user management page.",
        variant: "destructive"
      });
    }
  }, [userRole, navigate, toast]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        if (!tenantId) {
          throw new Error("Missing tenant ID");
        }
        
        // Get users from the breeder_profiles table (which contains role info)
        const { data, error: profilesError } = await supabase
          .from('breeder_profiles')
          .select('*')
          .eq('tenant_id', tenantId);
        
        if (profilesError) throw profilesError;
        
        if (data) {
          // Map the profile data to our UserWithProfile type
          const formattedUsers = data.map((profile: any) => ({
            id: profile.id,
            email: profile.email,
            created_at: profile.created_at,
            last_sign_in_at: null, // We don't have this in breeder_profiles
            first_name: profile.first_name,
            last_name: profile.last_name,
            profile_image_url: profile.profile_image_url,
            role: profile.role,
            tenant_id: profile.tenant_id || tenantId // Use the tenant_id if available, otherwise use current tenant
          })) as UserWithProfile[];
          
          setUsers(formattedUsers);
        }
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      fetchUsers();
    }
  }, [tenantId]);

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

  const handleUserUpdated = () => {
    // Refresh the user list
    const fetchUsers = async () => {
      try {
        if (!tenantId) {
          throw new Error("Missing tenant ID");
        }

        const { data, error: profilesError } = await supabase
          .from('breeder_profiles')
          .select('*')
          .eq('tenant_id', tenantId);
        
        if (profilesError) throw profilesError;
        
        if (data) {
          // Map the profile data to our UserWithProfile type
          const formattedUsers = data.map((profile: any) => ({
            id: profile.id,
            email: profile.email,
            created_at: profile.created_at,
            last_sign_in_at: null,
            first_name: profile.first_name,
            last_name: profile.last_name,
            profile_image_url: profile.profile_image_url,
            role: profile.role,
            tenant_id: profile.tenant_id || tenantId // Use the tenant_id if available, otherwise use current tenant
          })) as UserWithProfile[];
          
          setUsers(formattedUsers);
        }
      } catch (err: any) {
        console.error('Error refreshing users:', err);
      }
    };

    fetchUsers();
  };

  // Show a different message if there's no admin yet
  if (loading) {
    return <LoadingState message="Loading users..." />;
  }

  if (error) {
    return <ErrorState title="Could not load users" message={error} />;
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="User Management"
        subtitle="Manage users and their roles in your organization"
        actions={
          <Button onClick={handleOpenInvite} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
        }
      />
      
      <div className="mt-6">
        <UserTable 
          users={users} 
          currentUserId={user?.id || ''}
          onEditUser={handleEditUser}
          onUserUpdated={handleUserUpdated}
        />
      </div>

      <InviteUserDialog 
        open={isInviteOpen} 
        onClose={handleCloseInvite}
        onUserInvited={handleUserUpdated}
      />

      {selectedUser && (
        <EditUserDialog
          open={!!selectedUser}
          onClose={handleCloseEdit}
          user={selectedUser}
          currentUserId={user?.id || ''}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default UserManagement;
