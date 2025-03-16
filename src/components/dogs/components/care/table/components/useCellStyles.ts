
import { useMemo } from 'react';
import { DogFlag } from '@/types/dailyCare';

interface UseCellStylesProps {
  category: string;
  hasPottyBreak: boolean;
  hasCareLogged?: boolean;
  flags: DogFlag[];
}

export const useCellStyles = ({ 
  category, 
  hasPottyBreak, 
  hasCareLogged = false,
  flags 
}: UseCellStylesProps) => {
  // Process flags
  const isInHeat = useMemo(() => flags.some(flag => flag.type === 'in_heat'), [flags]);
  const isPregnant = useMemo(() => flags.some(flag => flag.type === 'pregnant'), [flags]);
  const hasIncompatibility = useMemo(() => flags.some(flag => flag.type === 'incompatible'), [flags]);
  
  // Determine if this is a potty category cell
  const isPottyCategory = useMemo(() => 
    category.toLowerCase().includes('potty') || 
    category === 'pottybreaks', 
  [category]);
  
  // Determine cell styling based on various conditions
  const cellClassNames = useMemo(() => {
    const baseClasses = 'text-center p-0 h-10 relative';
    
    if (hasCareLogged) {
      return `${baseClasses} bg-green-100 dark:bg-green-900/30`;
    }
    
    if (isPottyCategory && hasPottyBreak) {
      return `${baseClasses} bg-green-100 dark:bg-green-900/30`;
    }
    
    if (isInHeat) {
      return `${baseClasses} bg-red-50 dark:bg-red-900/20`;
    }
    
    if (isPregnant) {
      return `${baseClasses} bg-pink-50 dark:bg-pink-900/20`;
    }
    
    if (hasIncompatibility) {
      return `${baseClasses} bg-amber-50 dark:bg-amber-900/20`;
    }
    
    return baseClasses;
  }, [isPottyCategory, hasPottyBreak, hasCareLogged, isInHeat, isPregnant, hasIncompatibility]);
  
  return {
    cellClassNames,
    isPottyCategory,
    isInHeat,
    isPregnant,
    hasIncompatibility
  };
};
