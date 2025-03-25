
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { UserWithProfile } from '@/pages/UserManagement';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  TableCell,
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
import { getUserDisplayUtils } from '../utils/userDisplayUtils';

interface UserTableRowProps {
  user: UserWithProfile;
  currentUserId: string;
  onEditUser: (user: UserWithProfile) => void;
  onDeleteUser: (user: UserWithProfile) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  currentUserId,
  onEditUser,
  onDeleteUser,
}) => {
  const { getRoleBadgeVariant, getInitials } = getUserDisplayUtils();

  return (
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
                onClick={() => onDeleteUser(user)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deactivate user
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
