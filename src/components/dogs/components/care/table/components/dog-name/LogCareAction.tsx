
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface LogCareActionProps {
  dogId: string;
  dogName: string;
  activeCategory: string;
  onLogCareClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

const LogCareAction: React.FC<LogCareActionProps> = ({ 
  dogId,
  dogName,
  activeCategory,
  onLogCareClick,
  disabled = false 
}) => {
  // Determine button text based on category
  const getButtonText = () => {
    if (activeCategory === 'pottybreaks') {
      return 'Note';
    }
    return activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 dark:hover:text-blue-400"
      onClick={onLogCareClick}
      disabled={disabled}
      title={`Log ${activeCategory} for ${dogName}`}
    >
      <Calendar className="h-4 w-4" />
    </Button>
  );
};

export default LogCareAction;
