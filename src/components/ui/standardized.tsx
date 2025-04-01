import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

// Define the action prop type for EmptyState
export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  icon?: React.ReactNode;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: EmptyStateAction | React.ReactElement;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-background">
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      {action && (
        <div className="mt-4">
          {React.isValidElement(action) ? (
            action
          ) : (
            <Button
              onClick={(action as EmptyStateAction).onClick}
              disabled={(action as EmptyStateAction).disabled}
              variant={(action as EmptyStateAction).variant || 'default'}
            >
              {(action as EmptyStateAction).icon}
              {(action as EmptyStateAction).label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    disabled?: boolean;
    icon?: React.ReactNode; // Add icon support
  };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Button 
          onClick={action.onClick} 
          variant={action.variant || 'default'}
          disabled={action.disabled}
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Export PageHeader component to fix imports
export { default as PageHeader } from './standardized/PageHeader';

// Update LoadingState component to accept all the props that are being used in the codebase
export interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  withIcon?: boolean;
  onRetry?: () => void;
  showSkeleton?: boolean;
  skeletonCount?: number;
  skeletonVariant?: string;
  children?: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading...", 
  size = "medium",
  fullPage = false,
  withIcon = true,
  onRetry,
  showSkeleton = false,
  skeletonCount = 3,
  skeletonVariant = "default",
  children
}) => {
  return (
    <div className={fullPage ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50' : 'flex items-center justify-center p-8'}>
      <div className="text-center">
        <div className="mb-4">
          {withIcon && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>}
        </div>
        {message && <p className="text-muted-foreground">{message}</p>}
        {children}
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};

// Update ErrorState component to accept all the props being used
export interface ErrorStateProps {
  title?: string;
  message?: string;
  description?: string;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Error',
  message,
  description,
  onRetry,
  actionLabel = 'Try Again',
  onAction
}) => {
  const displayMessage = message || description || 'An error occurred.';
  
  return (
    <div className="p-8 text-center">
      <div className="text-red-500 mb-2">{title}</div>
      <p>{displayMessage}</p>
      {(onRetry || onAction) && (
        <Button 
          onClick={onAction || onRetry} 
          variant="outline" 
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  backPath?: string;
  backLink?: string;
  showAdminSetupLink?: boolean;
}

export const UnauthorizedState: React.FC<UnauthorizedStateProps> = ({
  title = "Unauthorized Access",
  description = "You don't have permission to view this content.",
  backPath,
  backLink,
  showAdminSetupLink
}) => {
  return (
    <div className="p-8 text-center">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {(backPath || backLink) && (
        <Button asChild variant="outline" className="mt-4">
          <a href={backPath || backLink || "/"}>Go Back</a>
        </Button>
      )}
      {showAdminSetupLink && (
        <Button asChild className="mt-4 ml-2">
          <a href="/admin/setup">Set Up Permissions</a>
        </Button>
      )}
    </div>
  );
};

export interface AuthLoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

export const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({ 
  message = "Checking authentication...",
  fullPage = false
}) => {
  return (
    <div className={fullPage ? "flex items-center justify-center h-screen" : "p-4"}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      {message && <p className="ml-3">{message}</p>}
    </div>
  );
};

export interface SkeletonLoaderProps {
  count?: number;
  variant?: string;
  width?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 3, variant = "default", width = "w-full", className = "" }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className={`animate-pulse ${className}`}>
        <div className={`h-4 bg-slate-200 dark:bg-slate-700 rounded ${width} mb-2`}></div>
        {variant !== "text" && <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>}
      </div>
    ))}
  </div>
);

export interface ConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmText?: string;
  confirmLabel?: string; // Added for backward compatibility
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
  children,
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  confirmText,
  confirmLabel,
  cancelText = "Cancel",
  variant = "destructive",
  isLoading = false
}) => {
  // Use either confirmText or confirmLabel (for backward compatibility)
  const buttonText = confirmText || confirmLabel || "Confirm";

  return (
    <div>
      {children}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            {description && <p className="text-muted-foreground mb-4">{description}</p>}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>{cancelText}</Button>
              <Button variant={variant} onClick={onConfirm} disabled={isLoading}>
                {isLoading ? "Loading..." : buttonText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  children, 
  onClick,
  variant = "default",
  disabled = false,
  className = "",
  isLoading = false,
  loadingText,
  icon
}) => {
  return (
    <Button 
      onClick={onClick} 
      variant={variant} 
      disabled={disabled || isLoading}
      className={className}
    >
      {icon}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
};
