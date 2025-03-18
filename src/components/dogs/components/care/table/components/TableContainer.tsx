
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';

interface TableContainerProps {
  children: React.ReactNode;
  dogs?: DogCareStatus[];
  activeCategory?: string;
  timeSlots?: string[];
  hasPottyBreak?: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged?: (dogId: string, timeSlot: string, category: string) => boolean;
  onCellClick?: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  onRefresh?: () => void;
  hasObservation?: (dogId: string) => boolean;
  onAddObservation?: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other') => Promise<void>;
  observations?: Record<string, Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>>;
}

const TableContainer: React.FC<TableContainerProps> = ({
  children,
  dogs = [],
  activeCategory = '',
  timeSlots = [],
  hasPottyBreak = () => false,
  hasCareLogged = () => false,
  onCellClick = () => {},
  onRefresh,
  hasObservation = () => false,
  onAddObservation,
  observations = {}
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
