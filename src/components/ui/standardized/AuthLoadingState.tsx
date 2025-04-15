
import React from 'react';
import { Loader2 } from 'lucide-react';

export interface AuthLoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

export const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({ 
  message = 'Loading...', 
  fullPage = false 
}) => {
  const containerClasses = fullPage 
    ? "flex flex-col items-center justify-center min-h-screen bg-background"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-xl font-medium text-muted-foreground">{message}</p>
    </div>
  );
};

export default AuthLoadingState;
