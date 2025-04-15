
import React, { ReactNode } from 'react';
import { AlertTriangle, Loader2, Ban } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Re-export the individual component files
export { default as PageHeader } from './standardized/PageHeader';
export type { PageHeaderProps } from './standardized/PageHeader';

export { default as SectionHeader } from './standardized/SectionHeader';
export type { SectionHeaderProps } from './standardized/SectionHeader';

export { default as AuthLoadingState } from './standardized/AuthLoadingState';
export type { AuthLoadingStateProps } from './standardized/AuthLoadingState';

export { default as UnauthorizedState } from './standardized/UnauthorizedState';
export type { UnauthorizedStateProps } from './standardized/UnauthorizedState';

export { default as EmptyState } from './standardized/EmptyState';
export type { EmptyStateProps } from './standardized/EmptyState';

export { default as ConfirmDialog } from './standardized/ConfirmDialog';
export type { ConfirmDialogProps } from './standardized/ConfirmDialog';

export { default as ErrorState } from './standardized/ErrorState';
export type { ErrorStateProps } from './standardized/ErrorState';

export { default as LoadingState } from './standardized/LoadingState';
export type { LoadingStateProps } from './standardized/LoadingState';

// Also export the components directly for backward compatibility
// Loading state component
export interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'medium',
  fullPage = false,
  className 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-10 w-10'
  };

  const containerClasses = fullPage 
    ? "flex flex-col items-center justify-center min-h-screen bg-background"
    : cn("flex flex-col items-center justify-center py-12", className);

  return (
    <div className={containerClasses}>
      <Loader2 className={`${sizeClasses[size]} text-primary animate-spin mb-4`} />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
};

// Error state component
export interface ErrorStateProps {
  title?: string;
  description?: string;
  message?: string; // Adding alternative property name for compatibility
  retryAction?: () => void;
  onRetry?: () => void; // Adding alternative property name for compatibility
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An error occurred',
  description,
  message, // Allow either message or description
  retryAction,
  onRetry, // Allow either onRetry or retryAction
  className
}) => {
  const errorMessage = description || message || 'Failed to load the requested data.';
  const retryHandler = retryAction || onRetry;
  
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{errorMessage}</p>
      {retryHandler && (
        <Button onClick={retryHandler} variant="default">
          Try Again
        </Button>
      )}
    </div>
  );
};

// Unauthorized state component
export interface UnauthorizedStateProps {
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
    disabled?: boolean; // Added for backward compatibility
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
        <Button 
          onClick={action.onClick}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
