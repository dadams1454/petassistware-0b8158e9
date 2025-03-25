
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserWithProfile } from '@/pages/UserManagement';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserTableRow } from './components/UserTableRow';
import { DeleteUserDialog } from './components/DeleteUserDialog';
import { EmptyUserTableState } from './components/EmptyUserTableState';

interface UserTableProps {
  users: UserWithProfile[];
  currentUserId: string;
  onEditUser: (user: UserWithProfile) => void;
  onUserUpdated: () => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUserId,
  onEditUser,
  onUserUpdated,
}) => {
  const { toast } = useToast();
  const [userToDelete, setUserToDelete] = useState<UserWithProfile | null>(null);

  const handleDeleteUser = async (userId: string) => {
    try {
      // We're not actually deleting the Supabase auth user, just updating the profile
      const { error } = await supabase
        .from('breeder_profiles')
        .update({ role: 'inactive' })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'User deactivated',
        description: 'The user has been successfully deactivated.',
      });

      setUserToDelete(null);
      onUserUpdated();
    } catch (error: any) {
      console.error('Error deactivating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to deactivate user',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <EmptyUserTableState />
            ) : (
              users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  currentUserId={currentUserId}
                  onEditUser={onEditUser}
                  onDeleteUser={setUserToDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteUserDialog
        user={userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      />
    </>
  );
};
