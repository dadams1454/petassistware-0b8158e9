
import React from 'react';
import { UserPlus, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/standardized';
import { useNavigate } from 'react-router-dom';

interface UserManagementHeaderProps {
  onOpenInvite: () => void;
  onSignOutAllUsers: () => void;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ 
  onOpenInvite, 
  onSignOutAllUsers 
}) => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <PageHeader
      title="User Management"
      subtitle="Manage users and their roles in your organization"
      backLink="/dashboard"
      action={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBackToDashboard} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button variant="destructive" onClick={onSignOutAllUsers} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out All Users
          </Button>
          <Button onClick={onOpenInvite} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
        </div>
      }
    />
  );
};
