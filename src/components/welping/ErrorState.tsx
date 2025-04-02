
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message = "An error occurred." }) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/welping')}
          >
            Back to Whelping Dashboard
          </Button>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
