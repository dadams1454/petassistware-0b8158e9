
import React from 'react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { DogWithPottyTime } from '../hooks/usePottyReminder';
import { DogCareStatus } from '@/types/dailyCare';

export const getTimeSinceLastPottyBreak = (lastBreak: string | null): string => {
  if (!lastBreak) return 'in a long time';
  
  try {
    const lastBreakDate = parseISO(lastBreak);
    return formatDistanceToNow(lastBreakDate, { addSuffix: true });
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'at an unknown time';
  }
};

interface DogPottyListProps {
  dogs: DogWithPottyTime[];
  onObservationClick: (dog: DogCareStatus) => void;
}

const DogPottyList: React.FC<DogPottyListProps> = ({ dogs, onObservationClick }) => {
  return (
    <div className="space-y-2">
      {dogs.map(({ dog, lastBreak }) => (
        <div 
          key={dog.dog_id} 
          className="flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-md"
        >
          <div className="flex items-center gap-2">
            {dog.dog_photo && (
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <img 
                  src={dog.dog_photo} 
                  alt={dog.dog_name} 
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-medium text-sm text-amber-800 dark:text-amber-300">
                {dog.dog_name}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Last potty break: {getTimeSinceLastPottyBreak(lastBreak)}
              </p>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30"
            onClick={() => onObservationClick(dog)}
          >
            <FileText className="h-4 w-4 mr-1" />
            <span>Observe</span>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DogPottyList;
