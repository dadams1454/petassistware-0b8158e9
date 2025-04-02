
import React from 'react';
import { PageHeader } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { UserPlus, LogOut } from 'lucide-react';

interface UserManagementHeaderProps {
  onOpenInvite: () => void;
  onSignOutAllUsers?: () => void;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  onOpenInvite,
  onSignOutAllUsers,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <PageHeader
        title="User Management"
        subtitle="Manage user accounts and permissions"
      />
      <div className="flex gap-2">
        {onSignOutAllUsers && (
          <Button variant="outline" onClick={onSignOutAllUsers}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out All Users
          </Button>
        )}
        <Button onClick={onOpenInvite}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>
    </div>
  );
};
