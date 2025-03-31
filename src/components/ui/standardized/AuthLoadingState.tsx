
import React from 'react';
import { PawPrint, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthLoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  withIcon?: boolean;
  onRetry?: () => void;
}

/**
 * AuthLoadingState - A specialized loading component for authentication processes
 * Extends the base LoadingState component with authentication-specific styling
 */
const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({
  message = 'Verifying authentication...',
  size = 'medium',
  fullPage = true,
  withIcon = true,
  onRetry
}) => {
  const handleRefresh = () => {
    console.log('Auth refresh requested, reloading page');
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-12 w-12'
  };

  if (!withIcon) {
    return (
      <div className={fullPage ? 'fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50' : 'flex flex-col items-center justify-center py-8'}>
        <div className="text-center">
          <div className="mb-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  const container = fullPage 
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center py-8';
  
  return (
    <div className={container}>
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className="relative mb-2">
          <PawPrint className={`${sizeMap[size]} text-primary`} />
          <Loader2 className={`absolute inset-0 ${sizeMap[size]} text-primary animate-spin opacity-70`} />
        </div>
        
        {message && (
          <p className="text-center text-muted-foreground mt-4 font-medium">{message}</p>
        )}
        
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm" 
          className="mt-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Page
        </Button>
      </div>
    </div>
  );
};

export default AuthLoadingState;
