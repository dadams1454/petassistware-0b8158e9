
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Dog } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { DogFlagsList } from '../../DogFlagsList';

interface DogNameCellProps {
  dog: DogCareStatus;
}

const DogNameCell: React.FC<DogNameCellProps> = ({ dog }) => {
  // Check if dog has any flags
  const hasFlags = dog.flags && dog.flags.length > 0;
  
  return (
    <TableCell className="font-medium sticky left-0 z-10 border-r border-slate-200 bg-white dark:bg-slate-900">
      <div className="flex items-center space-x-2">
        {dog.dog_photo ? (
          <img 
            src={dog.dog_photo} 
            alt={dog.dog_name} 
            className="w-6 h-6 rounded-full object-cover" 
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Dog className="h-3 w-3 text-primary" />
          </div>
        )}
        <div className="flex items-center">
          <span>{dog.dog_name}</span>
          {hasFlags && (
            <div className="ml-1 flex">
              <DogFlagsList flags={dog.flags} />
            </div>
          )}
        </div>
      </div>
    </TableCell>
  );
};

export default DogNameCell;
