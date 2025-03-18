
import React from 'react';
import { Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DogCareStatus } from '@/types/dailyCare';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface DogPottyListProps {
  dogs: Array<{
    dog: DogCareStatus;
    lastBreak: string | null;
  }>;
  onObservationClick: (dog: DogCareStatus) => void;
}

export const getTimeSinceLastPottyBreak = (lastBreakTime: string | null) => {
  if (!lastBreakTime) return 'Never';
  return formatDistanceToNow(parseISO(lastBreakTime), { addSuffix: true });
};

const DogPottyList: React.FC<DogPottyListProps> = ({ dogs, onObservationClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {dogs.map(({ dog, lastBreak }) => (
        <div key={dog.dog_id} className="flex items-center bg-white dark:bg-slate-800 rounded-md p-2 shadow-sm">
          <div className="flex-shrink-0 mr-2">
            {dog.dog_photo ? (
              <img 
                src={dog.dog_photo} 
                alt={dog.dog_name} 
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-xs">{dog.dog_name.charAt(0)}</span>
              </div>
            )}
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="text-sm font-medium truncate">{dog.dog_name}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span className="truncate">{getTimeSinceLastPottyBreak(lastBreak)}</span>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className="ml-2 p-1 h-auto"
            onClick={() => onObservationClick(dog)}
            title={`Add observation for ${dog.dog_name}`}
          >
            <MessageCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DogPottyList;
