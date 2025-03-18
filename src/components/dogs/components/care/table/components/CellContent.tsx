
import React from 'react';
import { Check } from 'lucide-react';

interface CellContentProps {
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  isCurrentHour?: boolean;
}

const CellContent: React.FC<CellContentProps> = ({
  hasPottyBreak,
  hasCareLogged,
  isCurrentHour = false
}) => {
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
          aria-label={hasPottyBreak ? "Potty break logged" : "Care logged"}
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
