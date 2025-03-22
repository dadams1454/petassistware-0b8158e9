
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import { MessageCircle, Paintbrush } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import DogColorPicker from '@/components/personalization/DogColorPicker';

interface DogNameCellProps {
  dog: DogCareStatus;
  onCareLogClick: () => void;
  onDogClick: () => void;
  activeCategory: string;
  hasObservation?: boolean;
  observationText?: string;
  observationType?: string;
}

const DogNameCell: React.FC<DogNameCellProps> = ({ 
  dog, 
  onCareLogClick, 
  onDogClick,
  activeCategory,
  hasObservation = false,
  observationText = '',
  observationType = ''
}) => {
  // Get gender-based background color using pastel colors
  const genderBackgroundColor = dog.sex === 'male' 
    ? 'bg-blue-50 dark:bg-blue-950/30' 
    : 'bg-pink-50 dark:bg-pink-950/30';
  
  // Determine button text based on category
  const getButtonText = () => {
    if (activeCategory === 'pottybreaks') {
      return 'Note';
    }
    return activeCategory;
  };
  
  // Format the observation type for display
  const getObservationTypeLabel = () => {
    switch (observationType) {
      case 'accident':
        return 'Accident';
      case 'heat':
        return 'Heat cycle';
      case 'behavior':
        return 'Behavior';
      case 'other':
        return 'Note';
      default:
        return 'Observation';
    }
  };
  
  return (
    <TableCell 
      className={`whitespace-nowrap sticky left-0 z-10 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 ${genderBackgroundColor}`}
    >
      <div className="flex items-center gap-3 max-w-[160px]">
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
        
        <div className="overflow-hidden flex flex-col">
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
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[60px]"
              title={`Log ${activeCategory} for ${dog.dog_name}`}
            >
              Log {getButtonText()}
            </button>
            
            <DogColorPicker 
              dogId={dog.dog_id}
              dogName={dog.dog_name}
              trigger={
                <button
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 ml-1"
                  title={`Customize ${dog.dog_name}'s appearance`}
                >
                  <Paintbrush className="h-3 w-3" />
                </button>
              }
            />
          </div>
          
          {/* Observation display - show text instead of icon */}
          {hasObservation && observationText && (
            <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 max-w-[140px]">
              <MessageCircle 
                size={12} 
                className="flex-shrink-0 text-amber-500 dark:text-amber-400 fill-amber-100 dark:fill-amber-900/30" 
                aria-label="Observation"
              />
              <span className="truncate" title={observationText}>
                <span className="font-medium">{getObservationTypeLabel()}:</span> {observationText}
              </span>
            </div>
          )}
        </div>
      </div>
    </TableCell>
  );
};

export default DogNameCell;
