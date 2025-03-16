
import { ReactNode } from 'react';
import { DogFlag } from '@/types/dailyCare';

export interface CareCategory {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface DogCellStyles {
  cellClassNames: string;
  isPottyCategory: boolean;
  isInHeat: boolean;
  isPregnant: boolean;
  hasIncompatibility: boolean;
  hasSpecialAttention: boolean;
}
