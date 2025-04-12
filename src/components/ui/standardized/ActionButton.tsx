
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

export interface ActionButtonProps extends ButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  icon,
  disabled = false,
  variant = "default",
  size = "default",
  className,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  );
};

export default ActionButton;
