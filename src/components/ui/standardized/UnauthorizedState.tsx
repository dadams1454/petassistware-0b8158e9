
import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  backPath?: string; // Added property
  showAdminSetupLink?: boolean; // Added property
}

const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({
  title = "Access Denied",
  description = "You don't have permission to access this resource.",
  actionLabel = "Go Back",
  onAction,
  backPath = "/dashboard",
  showAdminSetupLink = false
}) => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    if (onAction) {
      onAction();
    } else if (backPath) {
      navigate(backPath);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-destructive/10 p-3 rounded-full mb-4">
        <Shield className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      
      <div className="flex flex-col gap-3">
        <Button onClick={handleGoBack} variant="outline">
          {actionLabel}
        </Button>
        
        {showAdminSetupLink && (
          <Button 
            variant="link" 
            className="text-sm"
            onClick={() => navigate('/settings/users')}
          >
            Setup Admin Access
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnauthorizedState;
