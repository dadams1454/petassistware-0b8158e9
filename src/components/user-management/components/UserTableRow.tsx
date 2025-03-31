
import React, { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { UserWithProfile } from '@/types/user';
import { DeleteUserDialog } from './DeleteUserDialog';
import { formatDateForDisplay } from '@/utils/dateUtils';

interface UserTableRowProps {
  user: UserWithProfile;
  isCurrentUser: boolean;
  onEdit: (user: UserWithProfile) => void;
  onDelete: (userId: string) => void;
}

export function UserTableRow({
  user,
  isCurrentUser,
  onEdit,
  onDelete,
}: UserTableRowProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    onEdit(user);
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = (userId: string) => {
    onDelete(userId);
    setIsDeleteDialogOpen(false);
  };

  // Format dates for display
  const formattedCreatedAt = formatDateForDisplay(user.created_at);
  const formattedLastSignIn = user.last_sign_in_at 
    ? formatDateForDisplay(user.last_sign_in_at) 
    : 'Never';

  // Get full name or fallback to email
  const fullName = 
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.email;

  // Return variant based on user role
  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'owner':
        return 'destructive';
      case 'staff':
        return 'secondary';
      case 'veterinarian':
        return 'outline';
      case 'groomer':
        return 'secondary';
      case 'assistant':
        return 'secondary';
      case 'caretaker':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          {fullName}
          {isCurrentUser && (
            <Badge variant="outline" className="ml-2">
              You
            </Badge>
          )}
        </TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Badge
            variant={getRoleBadgeVariant(user.role)}
          >
            {user.role || 'user'}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {formattedCreatedAt}
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          {formattedLastSignIn}
        </TableCell>
        <TableCell>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleEdit}
              title="Edit user"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {!isCurrentUser && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleOpenDeleteDialog}
                title="Delete user"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <DeleteUserDialog
        user={isDeleteDialogOpen ? user : null}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
