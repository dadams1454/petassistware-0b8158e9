
import React from 'react';

export interface CellBackgroundProps {
  dogId: string;
  category: string;
  isActive?: boolean;
  isIncident?: boolean;
  isCurrentHour?: boolean;
  hasCareLogged?: boolean;
}

/**
 * Determines styling classes for a cell background based on its state
 */
const CellBackground: React.FC<CellBackgroundProps> = ({ 
  dogId, 
  category, 
  isActive = false, 
  isIncident = false, 
  isCurrentHour = false,
  hasCareLogged = false
}) => {
  // Determine background color class based on cell state
  let bgColorClass = 'bg-white dark:bg-gray-950';
  let borderColorClass = 'border-transparent';
  
  // Incident takes highest priority (red background)
  if (isIncident) {
    bgColorClass = 'bg-red-50 dark:bg-red-950/30';
    borderColorClass = 'border-red-200 dark:border-red-800/50';
  }
  // Active state (being clicked or hovered)
  else if (isActive) {
    bgColorClass = 'bg-blue-50 dark:bg-blue-950/30';
    borderColorClass = 'border-blue-200 dark:border-blue-800/50';
  }
  // Current hour for potty breaks
  else if (isCurrentHour && category === 'pottybreaks') {
    bgColorClass = 'bg-blue-50/50 dark:bg-blue-950/20';
    borderColorClass = 'border-blue-100 dark:border-blue-900/30';
  }
  // Logged care (green background)
  else if (hasCareLogged) {
    bgColorClass = 'bg-green-50/50 dark:bg-green-950/20';
    borderColorClass = 'border-green-100 dark:border-green-900/30';
  }
  
  return (
    <div className={`absolute inset-0 ${bgColorClass} border-2 ${borderColorClass} rounded-md transition-colors duration-200`} />
  );
};

export default CellBackground;
