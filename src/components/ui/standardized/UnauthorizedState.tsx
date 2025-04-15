
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  backPath?: string;
  showAdminSetupLink?: boolean;
}

const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({
  title = "Access Denied",
  description = "You don't have permission to access this resource.",
  backPath = "/",
  showAdminSetupLink = false
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-red-50 text-red-800 p-4 rounded-full mb-4">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => navigate(backPath)}
          variant="outline"
        >
          Go Back
        </Button>
        
        {showAdminSetupLink && (
          <Button
            onClick={() => navigate('/admin/permissions')}
            variant="secondary"
          >
            Setup Permissions
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnauthorizedState;
