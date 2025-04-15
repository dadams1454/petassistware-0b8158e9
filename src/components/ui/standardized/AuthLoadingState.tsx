
import React from 'react';
import { Loader2 } from 'lucide-react';

interface AuthLoadingStateProps {
  message?: string;
}

const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({
  message = "Authenticating..."
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="animate-spin mb-4">
        <Loader2 className="h-10 w-10 text-primary" />
      </div>
      <p className="text-lg text-center text-muted-foreground">
        {message}
      </p>
    </div>
  );
};

export default AuthLoadingState;
