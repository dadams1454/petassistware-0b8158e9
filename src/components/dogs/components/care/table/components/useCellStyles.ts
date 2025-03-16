
import { DogFlag } from '@/types/dailyCare';
import { useMemo } from 'react';

interface CellStylesProps {
  category: string;
  hasPottyBreak: boolean;
  flags: DogFlag[];
}

export const useCellStyles = ({ category, hasPottyBreak, flags }: CellStylesProps) => {
  const isPottyCategory = category === 'pottybreaks';
  const isInHeat = flags.some(flag => flag.type === 'in_heat');
  const isPregnant = flags.some(flag => flag.type === 'special_attention' && flag.value?.includes('pregnant'));
  const hasIncompatibility = flags.some(flag => flag.type === 'incompatible');
  const hasSpecialAttention = flags.some(flag => flag.type === 'special_attention');
  
  const getBorderColor = () => {
    if (isInHeat) return 'border-red-400';
    if (isPregnant) return 'border-pink-400';
    if (hasIncompatibility) return 'border-amber-400';
    if (hasSpecialAttention) return 'border-blue-400';
    return 'border-slate-200';
  };
  
  const cellClassNames = useMemo(() => {
    return `text-center p-0 h-10 border ${getBorderColor()}
      ${isPottyCategory ? 'cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/20' : ''}
      ${(isPottyCategory && hasPottyBreak) ? 'bg-green-50 dark:bg-green-900/10' : ''}
      ${isInHeat ? 'bg-red-50 dark:bg-red-900/10' : ''}
      ${isPregnant ? 'bg-pink-50 dark:bg-pink-900/10' : ''}
      ${hasIncompatibility ? 'bg-amber-50 dark:bg-amber-900/10' : ''}
      ${hasSpecialAttention && !isPregnant ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`;
  }, [isPottyCategory, hasPottyBreak, isInHeat, isPregnant, hasIncompatibility, hasSpecialAttention, getBorderColor]);
  
  return {
    cellClassNames,
    isPottyCategory,
    isInHeat,
    isPregnant,
    hasIncompatibility,
    hasSpecialAttention
  };
};
