
import React, { memo } from 'react';
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
  isPendingFeeding?: boolean;
}

// Use memo to prevent unnecessary re-renders for static content
const CellContent = memo(({
  dogName,
  timeSlot,
  category,
  hasPottyBreak,
  hasCareLogged,
  isCurrentHour = false,
  isIncident = false,
  isClicked = false,
  isPendingFeeding = false
}: CellContentProps) => {
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
    
    // If feeding is logged, show checkmark with "Fed" label
    if (hasCareLogged) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Check 
              className="h-4 w-4 text-green-600 dark:text-green-400" 
              aria-label={`${timeSlot} feeding completed`}
            />
            <div className="text-[9px] text-green-600 dark:text-green-400 mt-0.5 font-medium">
              Fed
            </div>
          </div>
        </div>
      );
    }
    
    // If feeding is pending, show loading indicator with improved animation
    if (isPendingFeeding) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center animate-pulse">
            <Clock 
              className="h-4 w-4 text-blue-500 dark:text-blue-400 animate-spin" 
              aria-label={`Recording ${timeSlot} feeding...`}
            />
            <div className="text-[9px] text-blue-500 dark:text-blue-400 mt-0.5">
              Logging...
            </div>
          </div>
        </div>
      );
    }
    
    // If clicked but not yet pending (transition state), show quick loading animation
    if (isClicked) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Clock 
                className="h-4 w-4 text-blue-500 dark:text-blue-400 animate-spin" 
                aria-label={`Recording ${timeSlot} feeding...`}
              />
              <div className="absolute inset-0 bg-primary/10 animate-ping rounded-full"></div>
            </div>
            <div className="text-[9px] text-blue-500 dark:text-blue-400 mt-0.5">
              Logging...
            </div>
          </div>
        </div>
      );
    }
    
    // Default feeding state (not logged)
    return (
      <div className="w-full h-full flex items-center justify-center group">
        <div className="flex flex-col items-center">
          <UtensilsCrossed 
            className="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors" 
            aria-label={`${timeSlot} feeding not recorded yet`}
          />
          <div className="text-[9px] text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 mt-0.5 transition-colors">
            {timeSlot}
          </div>
        </div>
      </div>
    );
  }

  // Original potty break content with enhanced visual feedback
  return (
    <div className="w-full h-full flex items-center justify-center group">
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
      {isCurrentHour && !hasPottyBreak && !hasCareLogged && !isPendingFeeding && (
        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-600"></div>
      )}
      
      {/* Show loading indicator when clicked with improved animation */}
      {isClicked && !hasPottyBreak && !hasCareLogged && !isCurrentHour && !isPendingFeeding && (
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="absolute inset-0 bg-primary/40 animate-ping rounded-full"></div>
          </div>
        </div>
      )}
      
      {/* Enhanced hover state for empty cells */}
      {!hasPottyBreak && !hasCareLogged && !isClicked && !isPendingFeeding && !isCurrentHour && (
        <div className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full group-hover:bg-primary dark:group-hover:bg-primary/80 transition-colors"></div>
        </div>
      )}
    </div>
  );
});

// Add display name for better debugging
CellContent.displayName = 'CellContent';

export default CellContent;
