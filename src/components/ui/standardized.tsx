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

export const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({ title = "Unauthorized", description = "You are not authorized to view this page.", backPath = "/dashboard", showAdminSetupLink = false }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(backPath);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Ban className="h-10 w-10 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md text-center">{description}</p>
      <Button onClick={handleGoBack} variant="outline">
        Go Back
      </Button>
      {showAdminSetupLink && (
        <Button variant="link" onClick={() => navigate('/admin/setup')}>
          Admin Setup
        </Button>
      )}
    </div>
  );
};
// Confirm dialog component
export interface ConfirmDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isOpen,
  onOpenChange,
}) => {
  return (
    <div className="relative">
      {/* Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground mb-4">{description}</p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={onCancel}>
                  {cancelLabel}
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
