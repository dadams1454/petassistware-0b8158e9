
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { UserWithProfile } from '@/types/user';
import { formatDistanceToNow } from 'date-fns';

interface UserTableRowProps {
  user: UserWithProfile;
  isCurrentUser: boolean;
  onEdit: (user: UserWithProfile) => void;
  onDelete: (userId: string) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isCurrentUser,
  onEdit,
  onDelete,
}) => {
  const userCreated = user.created_at ? new Date(user.created_at) : new Date();
  const timeAgo = formatDistanceToNow(userCreated, { addSuffix: true });

  // Get a display name from first_name + last_name or email if not available
  const displayName = user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user.name || 'Not set';

  const handleEdit = () => {
    onEdit(user);
  };

  const handleDelete = () => {
    if (isCurrentUser) {
      return;
    }
    onDelete(user.id);
  };

  return (
    <TableRow>
      <TableCell>{user.email}</TableCell>
      <TableCell>{displayName}</TableCell>
      <TableCell>{user.role || 'User'}</TableCell>
      <TableCell className="hidden md:table-cell">{timeAgo}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleEdit}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            onClick={handleDelete}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={isCurrentUser}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
