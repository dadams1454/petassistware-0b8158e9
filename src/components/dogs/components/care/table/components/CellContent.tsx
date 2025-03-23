
import React from 'react';
import { Check, AlertTriangle, UtensilsCrossed, Clock } from 'lucide-react';

export interface CellContentProps {
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  isCurrentHour?: boolean;
  isIncident?: boolean;
}

const CellContent: React.FC<CellContentProps> = ({
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  isCurrentHour = false,
  isIncident = false
}) => {
  // If there's an incident (didn't eat or potty accident), show alert icon
  if (isIncident) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <AlertTriangle 
          className="h-5 w-5 text-red-600 dark:text-red-400" 
          aria-label={`Incident reported for ${dogName} at ${timeSlot}`}
        />
      </div>
    );
  }
  
  // If care is logged (either potty break or feeding)
  if (hasPottyBreak || hasCareLogged) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Check 
            className={`h-4 w-4 ${
              category === 'feeding' 
                ? 'text-green-600 dark:text-green-400' 
                : isCurrentHour 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-green-600 dark:text-green-400'
            }`} 
            aria-label={category === 'feeding' ? `${timeSlot} feeding completed` : `Potty break logged at ${timeSlot}`}
          />
          {category === 'feeding' && (
            <div className="text-[9px] text-green-600 dark:text-green-400 mt-0.5 font-medium">
              Fed
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // For feeding category with no activity
  if (category === 'feeding') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <UtensilsCrossed 
            className="h-4 w-4 text-gray-400 dark:text-gray-600" 
            aria-label={`${timeSlot} feeding not recorded yet`}
          />
          <div className="text-[9px] text-gray-400 dark:text-gray-600 mt-0.5">
            {timeSlot}
          </div>
        </div>
      </div>
    );
  }
  
  // For potty break with current hour but no activity
  if (isCurrentHour) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-600"></div>
      </div>
    );
  }
  
  // Empty cell
  return <div className="w-full h-full" />;
};

export default CellContent;
