
import React from 'react';
import { PawPrint, Loader2 } from 'lucide-react';
import { LoadingState } from '@/components/ui/standardized';

interface AuthLoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  withIcon?: boolean;
}

/**
 * AuthLoadingState - A specialized loading component for authentication processes
 * Extends the base LoadingState component with authentication-specific styling
 */
const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({
  message = 'Verifying authentication...',
  size = 'medium',
  fullPage = true,
  withIcon = true
}) => {
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-12 w-12'
  };

  if (!withIcon) {
    return <LoadingState message={message} size={size} fullPage={fullPage} />;
  }

  const container = fullPage 
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center py-8';

  return (
    <div className={container}>
      <div className="relative animate-pulse">
        <PawPrint className={`${sizeMap[size]} text-primary`} />
      </div>
      {message && (
        <p className="text-center text-muted-foreground mt-4 font-medium">{message}</p>
      )}
    </div>
  );
};

export default AuthLoadingState;
