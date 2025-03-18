
import React from 'react';
import { DogFlag } from '@/types/dailyCare';
import { Check } from 'lucide-react';

interface CellContentProps {
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  flags?: DogFlag[];
  isCurrentHour?: boolean;
}

const CellContent: React.FC<CellContentProps> = ({
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  flags = [],
  isCurrentHour = false
}) => {
  // For now, primarily using pottyBreak status
  if (hasPottyBreak || hasCareLogged) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Check className={`h-4 w-4 ${isCurrentHour ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} />
      </div>
    );
  }
  
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
