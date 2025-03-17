
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
    let classes = 'text-center py-1 px-1 relative border';
    
    // Simple styling - highlight cells with potty breaks with light blue
    if (hasPottyBreak) {
      classes += ' bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    } else {
      classes += ' bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700';
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
