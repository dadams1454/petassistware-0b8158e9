
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ActionButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  loading = false,
  icon,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : icon ? (
        <div className="mr-2">{icon}</div>
      ) : null}
      {children}
    </Button>
  );
};

export default ActionButton;
