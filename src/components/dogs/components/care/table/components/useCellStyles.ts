
import { useCallback } from 'react';
import { DogFlag } from '@/types/dailyCare';
import { DogCellStyles } from './types';

interface CellStylesProps {
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged: boolean;
  flags: DogFlag[];
}

export const useCellStyles = ({
  category,
  hasPottyBreak,
  hasCareLogged,
  flags
}: CellStylesProps): DogCellStyles => {
  const getCellClassNames = useCallback(() => {
    // Base styles for all cells
    let classes = 'text-center py-2 px-1 relative border';
    
    // Default background if nothing special is happening
    let defaultBg = 'bg-white dark:bg-slate-800';
    
    // Handle potty break cells
    const isPottyCategory = category === 'pottybreaks';
    if (isPottyCategory) {
      if (hasPottyBreak) {
        classes += ' bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      } else {
        classes += ` ${defaultBg}`;
      }
    } 
    // Handle care logged cells
    else if (hasCareLogged) {
      classes += ' bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    } 
    // Default background
    else {
      classes += ` ${defaultBg}`;
    }
    
    // Highlight cells for dogs with flags
    const isInHeat = flags.some(flag => flag.type === 'in_heat');
    const isPregnant = flags.some(flag => flag.type === 'pregnant');
    const hasIncompatibility = flags.some(flag => flag.type === 'incompatible');
    const hasSpecialAttention = flags.some(flag => flag.type === 'special_attention');
    
    // Apply category-specific highlighting
    switch(category) {
      case 'feeding':
        if (!hasCareLogged) classes += ' hover:bg-yellow-50 dark:hover:bg-yellow-900/20';
        break;
      case 'medications':
        if (!hasCareLogged) classes += ' hover:bg-purple-50 dark:hover:bg-purple-900/20';
        break;
      case 'exercise':
        if (!hasCareLogged) classes += ' hover:bg-indigo-50 dark:hover:bg-indigo-900/20';
        break;
      case 'grooming':
        if (!hasCareLogged) classes += ' hover:bg-pink-50 dark:hover:bg-pink-900/20';
        break;
    }
    
    return classes;
  }, [category, hasPottyBreak, hasCareLogged, flags]);

  // Extract flag statuses
  const isInHeat = flags.some(flag => flag.type === 'in_heat');
  const isPregnant = flags.some(flag => flag.type === 'pregnant');
  const hasIncompatibility = flags.some(flag => flag.type === 'incompatible');
  const hasSpecialAttention = flags.some(flag => flag.type === 'special_attention');
  
  return {
    cellClassNames: getCellClassNames(),
    isPottyCategory: category === 'pottybreaks',
    isInHeat,
    isPregnant,
    hasIncompatibility,
    hasSpecialAttention
  };
};
