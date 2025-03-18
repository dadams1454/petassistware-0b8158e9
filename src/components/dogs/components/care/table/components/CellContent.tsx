
import React from 'react';
import { DogFlag } from '@/types/dailyCare';
import { Check, MessageCircle } from 'lucide-react';

interface CellContentProps {
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  flags?: DogFlag[];
  isCurrentHour?: boolean;
  hasObservation?: boolean;
}

const CellContent: React.FC<CellContentProps> = ({
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  flags = [],
  isCurrentHour = false,
  hasObservation = false
}) => {
  // Return observation icon if there's an observation
  if (hasObservation) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <MessageCircle 
          className="h-4 w-4 text-amber-600 dark:text-amber-400 fill-amber-100 dark:fill-amber-900/30" 
        />
      </div>
    );
  }
  
  // Return checkmark if any type of care is logged (potty break or other care)
  if (hasPottyBreak || hasCareLogged) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Check 
          className={`h-4 w-4 ${
            isCurrentHour 
              ? 'text-blue-600 dark:text-blue-400' 
              : hasPottyBreak 
                ? 'text-green-600 dark:text-green-400'
                : 'text-purple-600 dark:text-purple-400'
          }`} 
        />
      </div>
    );
  }
  
  // Show current hour indicator
  if (isCurrentHour) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-600"></div>
      </div>
    );
  }
  
  return null;
};

export default CellContent;
