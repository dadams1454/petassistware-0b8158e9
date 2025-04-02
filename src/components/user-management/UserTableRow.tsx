
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { UserWithProfile } from '@/types/user';

export interface UserTableRowProps {
  user: UserWithProfile;
  isCurrentUser: boolean;
  onEdit: (user: UserWithProfile) => void;
  onDelete: (userId: string) => Promise<void>;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isCurrentUser,
  onEdit,
  onDelete
}) => {
  return (
    <tr>
      <td className="px-4 py-2">{user.email}</td>
      <td className="px-4 py-2">{user.profile?.full_name || 'N/A'}</td>
      <td className="px-4 py-2">{user.role || 'User'}</td>
      <td className="px-4 py-2">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
      <td className="px-4 py-2 text-right">
        <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(user.id)}
          disabled={isCurrentUser}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </td>
    </tr>
  );
};

export default UserTableRow;
