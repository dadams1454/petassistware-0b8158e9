
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
    
    // Color coding based on category
    if (category === 'pottybreaks' && hasPottyBreak) {
      classes += ' bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    } else if (category === 'feeding' && hasCareLogged) {
      classes += ' bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    } else if (category === 'medication' && hasCareLogged) {
      classes += ' bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    } else if (category === 'grooming' && hasCareLogged) {
      classes += ' bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
    } else if (category === 'exercise' && hasCareLogged) {
      classes += ' bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    } else if (category === 'wellness' && hasCareLogged) {
      classes += ' bg-pink-100 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800';
    } else if (category === 'training' && hasCareLogged) {
      classes += ' bg-indigo-100 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800';
    } else if (category === 'notes' && hasCareLogged) {
      classes += ' bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    } else {
      classes += ' bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700';
    }
    
    // Special styles for cells with flags - use individual checks to prevent false positives
    if (flags.some(flag => flag.type === 'in_heat')) {
      classes += ' ring-2 ring-red-300 dark:ring-red-700';
    }
    
    if (flags.some(flag => flag.type === 'pregnant')) {
      classes += ' ring-2 ring-purple-300 dark:ring-purple-700';
    }
    
    if (flags.some(flag => flag.type === 'special_attention')) {
      classes += ' ring-1 ring-blue-300 dark:ring-blue-700';
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
