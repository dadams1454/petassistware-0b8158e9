
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface LogCareActionProps {
  onClick: () => void;
  disabled?: boolean;
}

const LogCareAction: React.FC<LogCareActionProps> = ({ onClick, disabled = false }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 dark:hover:text-blue-400"
      onClick={onClick}
      disabled={disabled}
      title="Log care for this dog"
    >
      <Calendar className="h-4 w-4" />
    </Button>
  );
};

export default LogCareAction;
