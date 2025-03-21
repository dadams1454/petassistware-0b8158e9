
import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface CellBackgroundProps {
  dogId: string;
  category: string;
  isActive: boolean;
  isIncident: boolean;
  isCurrentHour: boolean;
  hasCareLogged: boolean;
}

/**
 * Responsible for determining the background color of a cell based on its state
 */
export const CellBackground: React.FC<CellBackgroundProps> = ({
  dogId,
  category,
  isActive,
  isIncident,
  isCurrentHour,
  hasCareLogged
}) => {
  const { getDogColor } = useUserPreferences();
  const customDogColor = getDogColor(dogId);
  
  // Background color logic extracted from TimeSlotCell
  const getBgColor = () => {
    if (category === 'feeding') {
      if (isIncident) {
        return 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20';
      }
      if (hasCareLogged || isActive) {
        return 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/40';
      }
      return 'hover:bg-green-50 dark:hover:bg-green-900/10';
    }
    
    if (isIncident) {
      return 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20';
    } 
    if (hasCareLogged || isActive) {
      return 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/40'; 
    }
    if (isCurrentHour) {
      return 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20';
    }
    
    return customDogColor || 'hover:bg-blue-50 dark:hover:bg-blue-900/20';
  };

  // Border color logic extracted from TimeSlotCell
  const getBorderColor = () => {
    if (category === 'feeding') {
      if (isIncident) {
        return 'border-l-2 border-r-2 border-red-400 dark:border-red-600';
      }
      if (hasCareLogged || isActive) {
        return 'border-l-2 border-r-2 border-green-400 dark:border-green-600';
      }
      return '';
    }
    
    if (isIncident) {
      return 'border-l-2 border-r-2 border-red-400 dark:border-red-600';
    }
    if (isCurrentHour) {
      return 'border-l-2 border-r-2 border-blue-400 dark:border-blue-600';
    }
    return '';
  };

  return {
    bgColorClass: getBgColor(),
    borderColorClass: getBorderColor()
  };
};
