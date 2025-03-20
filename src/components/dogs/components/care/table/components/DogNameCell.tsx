
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import { MessageCircle } from 'lucide-react';
import DogAvatar from '../DogAvatar';

interface DogNameCellProps {
  dog: DogCareStatus;
  onCareLogClick: () => void;
  onDogClick: () => void;
  activeCategory: string;
  hasObservation?: boolean;
}

const DogNameCell: React.FC<DogNameCellProps> = ({ 
  dog, 
  onCareLogClick, 
  onDogClick,
  activeCategory,
  hasObservation = false
}) => {
  // Get gender color based on sex property
  const genderColor = dog.sex === 'male' ? 'bg-blue-500' : 'bg-pink-500';
  
  // Determine button text based on category
  const getButtonText = () => {
    if (activeCategory === 'pottybreaks') {
      return 'Note';
    }
    return activeCategory;
  };
  
  return (
    <TableCell 
      className="whitespace-nowrap sticky left-0 z-10 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 max-w-[160px]">
        <div 
          className={`w-1 h-10 rounded-full ${genderColor}`}
          aria-label={`${dog.sex === 'male' ? 'Male' : 'Female'} dog indicator`}
        ></div>
        
        <div 
          className="flex-shrink-0 h-10 w-10 cursor-pointer" 
          onClick={onDogClick}
          title={`View ${dog.dog_name}'s details`}
        >
          <img 
            src={dog.dog_photo || '/placeholder.svg'} 
            alt={dog.dog_name}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        
        <div className="overflow-hidden">
          <div 
            className="font-medium truncate max-w-[100px] cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" 
            title={dog.dog_name}
            onClick={onDogClick}
          >
            {dog.dog_name}
          </div>
          
          <div className="flex items-center gap-1 mt-1">
            <button
              onClick={onCareLogClick}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[100px]"
              title={`Log ${activeCategory} for ${dog.dog_name}`}
            >
              Log {getButtonText()}
            </button>
            
            {hasObservation && (
              <MessageCircle 
                size={14} 
                className="text-amber-500 dark:text-amber-400 fill-amber-100 dark:fill-amber-900/30" 
                aria-label={`${dog.dog_name} has observations`}
              />
            )}
          </div>
        </div>
      </div>
    </TableCell>
  );
};

export default DogNameCell;
