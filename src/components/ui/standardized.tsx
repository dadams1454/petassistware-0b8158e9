
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

// Define the action prop type for EmptyState
export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
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
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Export PageHeader component to fix imports
export { default as PageHeader } from './standardized/PageHeader';

// Add placeholder components for the missing components referenced in the errors
export const LoadingState = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    {children && <div className="ml-3">{children}</div>}
  </div>
);

export const ErrorState = ({ message }: { message: string }) => (
  <div className="p-8 text-center">
    <div className="text-red-500 mb-2">Error</div>
    <p>{message}</p>
  </div>
);

export const UnauthorizedState = () => (
  <div className="p-8 text-center">
    <h3 className="text-lg font-medium mb-2">Unauthorized Access</h3>
    <p className="text-muted-foreground">You don't have permission to view this content.</p>
  </div>
);

export const AuthLoadingState = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const SkeletonLoader = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

export const ConfirmDialog = ({ 
  children,
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive"
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}) => {
  return (
    <div>
      {children}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            {description && <p className="text-muted-foreground mb-4">{description}</p>}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>{cancelText}</Button>
              <Button variant={variant} onClick={onConfirm}>{confirmText}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ActionButton = ({ 
  children, 
  onClick,
  variant = "default",
  disabled = false,
  className = ""
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <Button 
      onClick={onClick} 
      variant={variant} 
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
};
