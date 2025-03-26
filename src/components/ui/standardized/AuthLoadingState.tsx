
import React, { useState, useEffect } from 'react';
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
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  
  // Add a timeout to show additional message if loading takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutOccurred(true);
    }, 5000); // 5 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
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
      <div className="flex flex-col items-center">
        <div className="relative mb-2">
          <PawPrint className={`${sizeMap[size]} text-primary`} />
          <Loader2 className={`absolute inset-0 ${sizeMap[size]} text-primary animate-spin opacity-70`} />
        </div>
        {message && (
          <p className="text-center text-muted-foreground mt-4 font-medium">{message}</p>
        )}
        {timeoutOccurred ? (
          <div className="mt-4 max-w-md space-y-2">
            <p className="text-center text-muted-foreground/80 text-sm">
              Authentication is taking longer than expected. You can try:
            </p>
            <ul className="text-sm text-muted-foreground/70 list-disc list-inside space-y-1">
              <li>Refreshing the page</li>
              <li>Checking your internet connection</li>
              <li>Signing in again if the issue persists</li>
            </ul>
          </div>
        ) : (
          <p className="text-center text-muted-foreground/70 text-sm mt-2">
            If this takes too long, try refreshing the page
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthLoadingState;
