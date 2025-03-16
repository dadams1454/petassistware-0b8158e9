
import { DogFlag } from '@/types/dailyCare';
import { useMemo } from 'react';
import { DogCellStyles } from './types';

interface CellStylesProps {
  category: string;
  hasPottyBreak: boolean;
  flags: DogFlag[];
}

export const useCellStyles = ({ category, hasPottyBreak, flags }: CellStylesProps): DogCellStyles => {
  const isPottyCategory = category === 'pottybreaks';
  
  // Check for specific flags that affect cell styling
  const isInHeat = flags.some(flag => flag.type === 'in_heat');
  const isPregnant = flags.some(flag => flag.type === 'pregnant');
  const hasIncompatibility = flags.some(flag => flag.type === 'incompatible');
  
  // Special attention is now handled exclusively in DogNameCell
  const hasSpecialAttention = false;
  
  const getBorderColor = () => {
    if (isInHeat) return 'border-red-400';
    if (isPregnant) return 'border-pink-400';
    if (hasIncompatibility) return 'border-amber-400';
    return 'border-slate-200';
  };
  
  const cellClassNames = useMemo(() => {
    return `text-center p-0 h-10 border ${getBorderColor()}
      ${isPottyCategory ? 'cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/20' : ''}
      ${(isPottyCategory && hasPottyBreak) ? 'bg-green-50 dark:bg-green-900/10' : ''}
      ${isInHeat ? 'bg-red-50 dark:bg-red-900/10' : ''}
      ${isPregnant ? 'bg-pink-50 dark:bg-pink-900/10' : ''}
      ${hasIncompatibility ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`;
  }, [isPottyCategory, hasPottyBreak, isInHeat, isPregnant, hasIncompatibility, getBorderColor]);
  
  return {
    cellClassNames,
    isPottyCategory,
    isInHeat,
    isPregnant,
    hasIncompatibility,
    hasSpecialAttention
  };
};
