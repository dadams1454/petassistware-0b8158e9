
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  redirectTo?: string;
  redirectLabel?: string;
}

const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({
  title = 'Access Denied',
  description = 'You don\'t have permission to view this page.',
  redirectTo = '/',
  redirectLabel = 'Go to Home'
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
      <div className="bg-amber-50 rounded-full p-4 mb-6">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <Button onClick={() => navigate(redirectTo)}>
        {redirectLabel}
      </Button>
    </div>
  );
};

export default UnauthorizedState;
