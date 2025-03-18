
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
    // Base styles for all cells - Excel-like with clear borders
    let classes = 'text-center py-1 px-1 relative h-10';
    
    // Highlight cells with logged potty breaks
    if (hasPottyBreak) {
      classes += ' bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    } else {
      classes += ' bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700';
    }
    
    // Special styles for cells with flags
    if (flags.some(flag => flag.type === 'in_heat')) {
      classes += ' ring-2 ring-red-300 dark:ring-red-700';
    }
    
    if (flags.some(flag => flag.type === 'pregnant')) {
      classes += ' ring-2 ring-purple-300 dark:ring-purple-700';
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
