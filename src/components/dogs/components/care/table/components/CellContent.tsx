
import React from 'react';
import { DogFlag } from '@/types/dailyCare';
import { Check, X, MessageCircle } from 'lucide-react';

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
          aria-label="Has observation"
        />
      </div>
    );
  }
  
  // Return checkmark if potty break is logged
  if (hasPottyBreak) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Check 
          className="h-5 w-5 text-green-600 dark:text-green-400" 
          aria-label="Potty break successful"
        />
      </div>
    );
  }
  
  // Return X mark if care is logged but not potty break (indicating the dog refused or had an accident)
  if (hasCareLogged && category === 'pottybreaks') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <X
          className="h-5 w-5 text-red-500 dark:text-red-400"
          aria-label="Potty break refused or accident"
        />
      </div>
    );
  }
  
  // Return regular checkmark for other types of care logged
  if (hasCareLogged) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Check 
          className="h-5 w-5 text-purple-600 dark:text-purple-400" 
          aria-label="Care logged"
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
