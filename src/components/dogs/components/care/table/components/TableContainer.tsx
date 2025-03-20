
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';

interface TableContainerProps {
  children: React.ReactNode;
  activeCategory?: string;
  dogsCount?: number;
  isMobile?: boolean;
  onRefresh?: () => void;
  dogs?: DogCareStatus[];
  timeSlots?: string[];
  hasPottyBreak?: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged?: (dogId: string, timeSlot: string, category: string) => boolean;
  hasObservation?: (dogId: string, timeSlot: string) => boolean;
  onCellClick?: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onCareLogClick?: (dogId: string, dogName: string) => void;
  onDogClick?: (dogId: string) => void;
}

const TableContainer: React.FC<TableContainerProps> = ({
  children,
  activeCategory = '',
  dogsCount,
  isMobile = false,
  onRefresh = () => {},
  dogs = [],
  timeSlots = [],
  hasPottyBreak = () => false,
  hasCareLogged = () => false,
  hasObservation = () => false,
  onCellClick = () => {},
  onCareLogClick = () => {},
  onDogClick = () => {}
}) => {
  return (
    <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="overflow-x-auto bg-white dark:bg-slate-900">
        <div className="min-w-max">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TableContainer;

