import React, { ReactNode } from 'react';
import { AlertTriangle, Loader2, Ban } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Re-export existing components
export { default as PageHeader } from './standardized/PageHeader';
export type { PageHeaderProps } from './standardized/PageHeader';

export { default as SectionHeader } from './standardized/SectionHeader';
export type { SectionHeaderProps } from './standardized/SectionHeader';

export { default as AuthLoadingState } from './standardized/AuthLoadingState';
export type { AuthLoadingStateProps } from './standardized/AuthLoadingState';

export { default as ErrorState } from './standardized/ErrorState';
export type { ErrorStateProps } from './standardized/ErrorState';

export { default as UnauthorizedState } from './standardized/UnauthorizedState';
export type { UnauthorizedStateProps } from './standardized/UnauthorizedState';

export { default as EmptyState } from './standardized/EmptyState';
export type { EmptyStateProps } from './standardized/EmptyState';

export { default as ConfirmDialog } from './standardized/ConfirmDialog';
export type { ConfirmDialogProps } from './standardized/ConfirmDialog';

export { default as LoadingState } from './standardized/LoadingState';
export type { LoadingStateProps } from './standardized/LoadingState';

// Add ActionButton export
export { default as ActionButton } from './standardized/ActionButton';
export type { ActionButtonProps } from './standardized/ActionButton';

// Interfaces for backward compatibility
export interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  className?: string;
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  message?: string; // Alternative property name for compatibility
  retryAction?: () => void;
  onRetry?: () => void; // Alternative property name for compatibility
  className?: string;
}

export interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  backPath?: string;
  showAdminSetupLink?: boolean;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  className?: string;
}

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
