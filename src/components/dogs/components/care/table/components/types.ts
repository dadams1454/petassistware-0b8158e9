
import { ReactNode } from 'react';

export interface CareCategory {
  id: string;
  name: string;
  icon: ReactNode;
}

export type CellFlagStatus = {
  isInHeat: boolean;
  isPregnant: boolean;
  hasIncompatibility: boolean;
  hasSpecialAttention: boolean;
};

export type DogCellStyles = {
  cellClassNames: string;
  isPottyCategory: boolean;
} & CellFlagStatus;
