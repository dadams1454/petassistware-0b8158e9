
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface ActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  onClick,
  variant = 'default',
  size = 'default',
  className,
  disabled = false,
  isLoading = false,
  loadingText,
  children,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn("gap-2", className)}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {loadingText || label}
        </>
      ) : (
        <>
          {icon}
          {children || label}
        </>
      )}
    </Button>
  );
};

export default ActionButton;
