
import React, { ReactNode } from 'react';
import { AlertTriangle, Loader2, Ban } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Loading state component
interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
};

// Error state component
interface ErrorStateProps {
  title?: string;
  description?: string;
  retryAction?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An error occurred',
  description = 'Failed to load the requested data.',
  retryAction,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {retryAction && (
        <Button onClick={retryAction} variant="default">
          Try Again
        </Button>
      )}
    </div>
  );
};

// Unauthorized state component
interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  backPath?: string;
  showAdminSetupLink?: boolean;
}

export const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({
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

// Empty state component
export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-16 px-4",
      className
    )}>
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
