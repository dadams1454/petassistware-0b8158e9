
import React, { useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';

interface TableDebuggerProps {
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
  useEffect(() => {
    console.log(`🐕 TableDebugger rendering with ${dogsStatus.length} dogs`);
    console.log('🐕 Selected category:', selectedCategory);
    console.log('🐕 Selected dog:', selectedDogId);
    console.log('🐕 Dialog open:', dialogOpen);
    
    if (dogsStatus.length > 0) {
      console.log('🐕 First dog object:', JSON.stringify(dogsStatus[0]).substring(0, 200) + '...');
    } else {
      console.warn('⚠️ No dogs available in DogCareTable');
    }
  }, [dogsStatus, selectedCategory, selectedDogId, dialogOpen]);

  return null; // This component doesn't render anything
};

export default TableDebugger;
