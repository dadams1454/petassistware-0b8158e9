
import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, UtensilsCrossed, Clock } from 'lucide-react';

export interface CellContentProps {
  dogName: string;
  timeSlot: string;
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  isCurrentHour?: boolean;
  isIncident?: boolean;
  isClicked?: boolean;
}

const CellContent: React.FC<CellContentProps> = ({
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  isCurrentHour = false,
  isIncident = false,
  isClicked = false
}) => {
  // Show feeding icon for feeding category
  if (category === 'feeding') {
    // If there's an incident for feeding (didn't eat), show alert icon
    if (isIncident) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <AlertTriangle 
            className="h-5 w-5 text-red-600 dark:text-red-400" 
            aria-label={`${dogName} didn't eat ${timeSlot} meal`}
          />
        </div>
      );
    }
    
    return (
      <div className="w-full h-full flex items-center justify-center">
        {hasCareLogged ? (
          <div className="flex flex-col items-center">
            <Check 
              className="h-4 w-4 text-green-600 dark:text-green-400" 
              aria-label={`${timeSlot} feeding completed`}
            />
            <div className="text-[9px] text-green-600 dark:text-green-400 mt-0.5 font-medium">
              Fed
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {isClicked ? (
              <div className="flex flex-col items-center animate-pulse">
                <Clock 
                  className="h-4 w-4 text-blue-500 dark:text-blue-400" 
                  aria-label={`Recording ${timeSlot} feeding...`}
                />
                <div className="text-[9px] text-blue-500 dark:text-blue-400 mt-0.5">
                  Logging...
                </div>
              </div>
            ) : (
              <>
                <UtensilsCrossed 
                  className="h-4 w-4 text-gray-400 dark:text-gray-600" 
                  aria-label={`${timeSlot} feeding not recorded yet`}
                />
                <div className="text-[9px] text-gray-400 dark:text-gray-600 mt-0.5">
                  {timeSlot}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Original potty break content
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Show appropriate icon based on content type */}
      {(hasPottyBreak || hasCareLogged) && (
        isIncident ? (
          <AlertTriangle 
            className="h-5 w-5 text-red-600 dark:text-red-400" 
            aria-label="Incident reported at this time"
          />
        ) : (
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
        )
      )}
      
      {/* Show current hour indicator when no other indicators are present */}
      {isCurrentHour && !hasPottyBreak && !hasCareLogged && (
        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-600"></div>
      )}
      
      {/* Show loading indicator when clicked */}
      {isClicked && !hasPottyBreak && !hasCareLogged && !isCurrentHour && (
        <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-ping"></div>
      )}
    </div>
  );
};

export default CellContent;
