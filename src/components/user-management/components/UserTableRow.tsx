import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, ShieldAlert } from 'lucide-react';
import { formatDateForDisplay } from '@/utils/dateUtils';

interface UserTableRowProps {
  user: any;
  onOpenEdit: (user: any) => void;
  onOpenDelete: (user: any) => void;
  onOpenPermissions: (user: any) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onOpenEdit,
  onOpenDelete,
  onOpenPermissions,
}) => {
  const userStatus = user.status || 'active'; // Default to 'active' if status is undefined
  const isPending = userStatus === 'pending';

  return (
    <tr>
      <td>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold">{user.name}</div>
            <div className="text-sm opacity-50">{user.email}</div>
          </div>
        </div>
      </td>
      <td>
        {user.role ? (
          <Badge variant="secondary">{user.role}</Badge>
        ) : (
          <span className="text-sm opacity-50">No Role</span>
        )}
      </td>
      <td>
        {user.lastLogin ? (
          formatDateForDisplay(user.lastLogin)
        ) : (
          <span className="text-sm opacity-50">Never</span>
        )}
      </td>
      <td>
        {isPending ? (
          <Badge variant="outline">Pending</Badge>
        ) : user.isVerified ? (
          <Badge className="bg-green-500 text-white">Verified</Badge>
        ) : (
          <Badge variant="destructive">Unverified</Badge>
        )}
      </td>
      <td>
        <div className="flex items-center">
          {user.isSuspended && (
            <ShieldAlert className="w-4 h-4 text-red-500 mr-2" />
          )}
          {user.isSuspended ? 'Suspended' : 'Active'}
        </div>
      </td>
      <td>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onOpenPermissions(user)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onOpenDelete(user)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
