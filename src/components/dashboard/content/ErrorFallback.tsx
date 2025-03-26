
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
  title: string;
  message: string;
  onRetry: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ title, message, onRetry }) => {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 my-4">
      <div className="flex items-center mb-2">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm mb-2">{message}</p>
      <button 
        onClick={onRetry}
        className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;
