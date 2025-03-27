
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  label?: string; // Make label optional
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  icon,
  isLoading = false,
  loadingText,
  variant = 'default',
  size = 'default',
  className,
  onClick,
  label, // Add label to destructuring
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={onClick}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || label || children}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </Button>
  );
};

export default ActionButton;
