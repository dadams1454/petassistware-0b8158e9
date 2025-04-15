
import React from 'react';
import { Loader2 } from 'lucide-react';

export interface AuthLoadingStateProps {
  message?: string;
}

const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({ 
  message = 'Authenticating...' 
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <h2 className="mt-6 text-xl font-semibold text-center">{message}</h2>
      <p className="mt-2 text-muted-foreground text-center">Please wait while we verify your credentials</p>
    </div>
  );
};

export default AuthLoadingState;
