
import React from 'react';
import { Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  backPath?: string;
  showAdminSetupLink?: boolean;
}

const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({
  title = 'Access Denied',
  description = 'You do not have permission to access this resource.',
  backPath = '/',
  showAdminSetupLink = false
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Ban className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <div className="flex gap-4">
        <Button variant="default" onClick={() => navigate(backPath)}>
          Back to Safety
        </Button>
        {showAdminSetupLink && (
          <Button variant="outline" onClick={() => navigate('/admin/setup')}>
            Admin Setup
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnauthorizedState;
