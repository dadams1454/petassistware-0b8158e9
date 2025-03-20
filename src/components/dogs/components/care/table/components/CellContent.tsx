
import React from 'react';
import { Check } from 'lucide-react';

export interface CellContentProps {
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
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Show checkmark if any type of care is logged */}
      {(hasPottyBreak || hasCareLogged) && (
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
      )}
      
      {/* Show current hour indicator when no other indicators are present */}
      {isCurrentHour && !hasPottyBreak && !hasCareLogged && (
        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-600"></div>
      )}
    </div>
  );
};

export default CellContent;
