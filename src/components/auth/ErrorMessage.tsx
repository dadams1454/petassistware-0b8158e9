
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive flex items-start">
      <AlertCircle className="shrink-0 h-5 w-5 mt-0.5 mr-2" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ErrorMessage;
