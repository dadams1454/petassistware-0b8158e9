
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Trash2, MoreHorizontal, Shield } from 'lucide-react';
import { UserWithProfile } from '@/pages/UserManagement';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'staff':
        return 'secondary';
      case 'viewer':
        return 'outline';
      case 'veterinarian':
      case 'buyer':
      default:
        return 'outline';
    }
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    if (!firstName && !lastName) return '??';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

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
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {user.profile_image_url ? (
                          <AvatarImage src={user.profile_image_url} alt={`${user.first_name} ${user.last_name}`} />
                        ) : (
                          <AvatarFallback>
                            {getInitials(user.first_name, user.last_name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.first_name
                            ? `${user.first_name} ${user.last_name || ''}`
                            : 'Unnamed User'}
                          {user.id === currentUserId && (
                            <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role || 'No Role'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.created_at
                      ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true })
                      : 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit user
                        </DropdownMenuItem>
                        {user.id !== currentUserId && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setUserToDelete(user)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deactivate user
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the user account for {userToDelete?.first_name}{' '}
              {userToDelete?.last_name} ({userToDelete?.email}). They will no longer be able to
              access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => userToDelete && handleDeleteUser(userToDelete.id)}
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
