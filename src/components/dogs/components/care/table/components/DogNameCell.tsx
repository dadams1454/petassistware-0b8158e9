
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import DogAvatar from '../DogAvatar';
import { getGenderColor } from '@/components/dogs/utils/dogFormUtils';

interface DogNameCellProps {
  dog: DogCareStatus;
  onCareLogClick: () => void;
  activeCategory: string;
}

const DogNameCell: React.FC<DogNameCellProps> = ({ 
  dog, 
  onCareLogClick, 
  activeCategory 
}) => {
  const genderColor = getGenderColor(dog.gender);
  
  return (
    <TableCell 
      className="whitespace-nowrap sticky left-0 z-10 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 max-w-[160px]">
        <div 
          className={`w-1 h-10 rounded-full ${genderColor}`}
          aria-label={`${dog.gender === 'male' ? 'Male' : 'Female'} dog indicator`}
        ></div>
        
        <div className="flex-shrink-0 h-10 w-10">
          <DogAvatar dog={dog} />
        </div>
        
        <div className="overflow-hidden">
          <div className="font-medium truncate max-w-[100px]" title={dog.dog_name}>
            {dog.dog_name}
          </div>
          
          <button
            onClick={onCareLogClick}
            className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[100px]"
            title={`Log ${activeCategory} for ${dog.dog_name}`}
          >
            Log {activeCategory === 'pottybreaks' ? 'break' : activeCategory}
          </button>
        </div>
      </div>
    </TableCell>
  );
};

export default DogNameCell;
