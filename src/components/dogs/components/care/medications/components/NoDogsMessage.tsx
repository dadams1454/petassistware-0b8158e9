
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface NoDogsMessageProps {
  onRefresh: () => void;
  isError?: boolean;
  errorMessage?: string;
}

const NoDogsMessage: React.FC<NoDogsMessageProps> = ({ 
  onRefresh, 
  isError = false, 
  errorMessage
}) => {
  return (
    <div className={`p-8 text-center border rounded-lg ${isError ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' : 'border-gray-200'}`}>
      {isError ? (
        <>
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 dark:text-red-400 font-medium">
            {errorMessage || 'There was an error loading data'}
          </p>
          <p className="text-muted-foreground mt-1 mb-4">
            This could be due to network issues or server problems.
          </p>
        </>
      ) : (
        <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
      )}
      <Button 
        onClick={onRefresh} 
        className={`mt-4 ${isError ? 'bg-red-600 hover:bg-red-700' : ''}`}
      >
        Refresh Dogs
      </Button>
    </div>
  );
};

export default NoDogsMessage;
