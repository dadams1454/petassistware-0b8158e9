
import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/types/ui';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends Omit<ButtonProps, 'children'> {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * ActionButton - A standardized button with icon support and loading state
 */
const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  icon,
  variant = 'default',
  size = 'default',
  isLoading = false,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(className)}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon && <span className="mr-2">{icon}</span>
      )}
      {label}
    </Button>
  );
};

export default ActionButton;
