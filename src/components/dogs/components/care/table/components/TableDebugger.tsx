
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';

export interface TableDebuggerProps {
  dogsStatus: DogCareStatus[];
  selectedCategory: string;
  selectedDogId: string | null;
  dialogOpen: boolean;
}

const TableDebugger: React.FC<TableDebuggerProps> = ({ 
  dogsStatus, 
  selectedCategory, 
  selectedDogId,
  dialogOpen 
}) => {
  // If not in development mode, don't render anything
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="hidden p-2 text-xs bg-gray-100 dark:bg-gray-900 border-b">
      <div><strong>Debug:</strong> {dogsStatus.length} dogs | Category: {selectedCategory}</div>
      <div>Selected Dog: {selectedDogId || 'none'} | Dialog Open: {dialogOpen ? 'true' : 'false'}</div>
    </div>
  );
};

export default TableDebugger;
