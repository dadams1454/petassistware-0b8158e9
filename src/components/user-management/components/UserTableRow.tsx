
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserWithProfile } from '@/types/user';

interface UserTableRowProps {
  user: UserWithProfile;
  currentUserId: string;
  onEditUser: (user: UserWithProfile) => void;
  onDeleteUser: (user: UserWithProfile) => void;
}

export function UserTableRow({
  user,
  currentUserId,
  onEditUser,
  onDeleteUser,
}: UserTableRowProps) {
  const isCurrentUser = user.id === currentUserId;
  
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return (first + last).toUpperCase() || 'U';
  };
  
  const getFullName = (firstName?: string | null, lastName?: string | null) => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return 'Unnamed User';
  };
  
  const getRoleBadgeVariant = (role: string | null) => {
    if (!role) return 'secondary';
    
    switch (role) {
      case 'owner':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'manager':
        return 'purple';
      case 'staff':
        return 'blue';
      case 'veterinarian':
        return 'green';
      case 'assistant':
        return 'yellow';
      default:
        return 'secondary';
    }
  };

  const getLastSignIn = (lastSignIn: string | null) => {
    if (!lastSignIn) return 'Never';
    
    try {
      return new Date(lastSignIn).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user.profile_image_url || ''} alt={getFullName(user.first_name, user.last_name)} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{getFullName(user.first_name, user.last_name)}</div>
            {isCurrentUser && <span className="text-xs text-muted-foreground">(You)</span>}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {user.role || 'User'}
        </Badge>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEditUser(user)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDeleteUser(user)}
            disabled={isCurrentUser}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
