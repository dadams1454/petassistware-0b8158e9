
import React from 'react';
import { Shield, AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showAdminSetupLink?: boolean;
  backPath?: string;
}

/**
 * UnauthorizedState - Display a message when a user lacks permissions
 * Can be used for both 401 (unauthenticated) and 403 (unauthorized) scenarios
 */
const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({
  title = 'Access Restricted',
  description = 'You do not have permission to access this resource. Please contact your administrator if you believe this is an error.',
  showBackButton = true,
  showHomeButton = true,
  showAdminSetupLink = false,
  backPath,
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoToAdminSetup = () => {
    navigate('/admin-setup');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[50vh]">
      <div className="rounded-full bg-destructive/10 p-3 mb-4">
        <Shield className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <div className="flex flex-wrap gap-4 justify-center">
        {showBackButton && (
          <Button variant="outline" onClick={handleGoBack}>
            Go Back
          </Button>
        )}
        {showHomeButton && (
          <Button onClick={handleGoHome}>
            Go to Dashboard
          </Button>
        )}
        {showAdminSetupLink && (
          <Button onClick={handleGoToAdminSetup} variant="secondary" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Go to Admin Setup
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnauthorizedState;
