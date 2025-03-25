
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/standardized';

interface UserManagementHeaderProps {
  onOpenInvite: () => void;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ 
  onOpenInvite 
}) => {
  return (
    <PageHeader
      title="User Management"
      subtitle="Manage users and their roles in your organization"
      actions={
        <Button onClick={onOpenInvite} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      }
    />
  );
};
