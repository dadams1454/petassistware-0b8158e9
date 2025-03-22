
import React from 'react';
import { Button } from '@/components/ui/button';
import DogColorPicker from '@/components/personalization/DogColorPicker';
import { Paintbrush } from 'lucide-react';

interface LogCareActionProps {
  dogId: string;
  dogName: string;
  activeCategory: string;
  onLogCareClick: (e: React.MouseEvent) => void;
}

const LogCareAction: React.FC<LogCareActionProps> = ({ 
  dogId, 
  dogName, 
  activeCategory, 
  onLogCareClick 
}) => {
  // Determine button text based on category
  const getButtonText = () => {
    if (activeCategory === 'pottybreaks') {
      return 'Note';
    }
    return activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
  };
  
  return (
    <div className="flex items-center gap-1 mt-1">
      <Button
        onClick={onLogCareClick}
        className="h-7 px-2 py-0 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 z-20 relative"
        title={`Log ${activeCategory} for ${dogName}`}
        variant="ghost"
        size="sm"
      >
        Log {getButtonText()}
      </Button>
      
      <DogColorPicker 
        dogId={dogId}
        dogName={dogName}
        trigger={
          <button
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 ml-1"
            title={`Customize ${dogName}'s appearance`}
          >
            <Paintbrush className="h-3 w-3" />
          </button>
        }
      />
    </div>
  );
};

export default LogCareAction;
