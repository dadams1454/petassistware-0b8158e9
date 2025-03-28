
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ActionButtonProps extends ButtonProps {
  loading?: boolean;
  isLoading?: boolean; // Added this property for compatibility
  icon?: React.ReactNode;
  children: React.ReactNode;
  loadingText?: string; // Added property for loading text
}

const ActionButton: React.FC<ActionButtonProps> = ({
  loading = false,
  isLoading = false, // Default to false
  icon,
  children,
  disabled,
  loadingText,
  ...props
}) => {
  // Use either loading or isLoading
  const isLoadingState = loading || isLoading;
  
  // Display either the loading text or the children when in loading state
  const displayText = isLoadingState && loadingText ? loadingText : children;
  
  return (
    <Button
      disabled={isLoadingState || disabled}
      {...props}
    >
      {isLoadingState ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : icon ? (
        <div className="mr-2">{icon}</div>
      ) : null}
      {displayText}
    </Button>
  );
};

export default ActionButton;
