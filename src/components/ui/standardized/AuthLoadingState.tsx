
import React, { useState, useEffect, useRef } from 'react';
import { PawPrint, Loader2, RefreshCw } from 'lucide-react';
import { LoadingState } from '@/components/ui/standardized';
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
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const [extendedTimeout, setExtendedTimeout] = useState(false);
  const initialTimeRef = useRef(Date.now());
  
  // Add a timeout to show additional message if loading takes too long
  useEffect(() => {
    const shortTimer = setTimeout(() => {
      setTimeoutOccurred(true);
    }, 3000); // Show first message after 3 seconds
    
    const longTimer = setTimeout(() => {
      setExtendedTimeout(true);
    }, 8000); // Show extended message after 8 seconds
    
    return () => {
      clearTimeout(shortTimer);
      clearTimeout(longTimer);
    };
  }, []);
  
  const handleRefresh = () => {
    // Reset the timeout states when manually retrying
    setTimeoutOccurred(false);
    setExtendedTimeout(false);
    initialTimeRef.current = Date.now();
    
    // Call the retry callback if provided
    if (onRetry) {
      onRetry();
    } else {
      // If no callback provided, just refresh the page
      window.location.reload();
    }
  };
  
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

  const elapsedSeconds = Math.floor((Date.now() - initialTimeRef.current) / 1000);
  
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
        
        {/* Add progress indication */}
        {elapsedSeconds > 0 && (
          <p className="text-xs text-muted-foreground/60 mt-1">
            ({elapsedSeconds}s)
          </p>
        )}
        
        {extendedTimeout ? (
          <div className="mt-6 max-w-md space-y-4 text-center px-4">
            <p className="text-amber-600 dark:text-amber-400 font-medium">
              Authentication is taking longer than expected.
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4 text-sm">
              <p className="text-muted-foreground mb-4">This could be due to:</p>
              <ul className="text-muted-foreground/80 list-disc list-inside space-y-2 text-left">
                <li>Server connection issues</li>
                <li>Expired or invalid authentication token</li>
                <li>Browser storage limitations</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleRefresh} 
              variant="default" 
              className="mt-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Authentication
            </Button>
          </div>
        ) : timeoutOccurred ? (
          <div className="mt-4 max-w-md space-y-2 px-4">
            <p className="text-center text-muted-foreground/80 text-sm">
              Still verifying your authentication. You can try:
            </p>
            <ul className="text-sm text-muted-foreground/70 list-disc list-inside space-y-1">
              <li>Waiting a few more seconds</li>
              <li>Refreshing the page</li>
              <li>Checking your internet connection</li>
            </ul>
          </div>
        ) : (
          <p className="text-center text-muted-foreground/70 text-sm mt-2">
            Please wait while we verify your credentials...
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthLoadingState;
