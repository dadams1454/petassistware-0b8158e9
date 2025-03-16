
import React, { useEffect } from 'react';
import { DogCareStatus } from '@/types/dailyCare';

interface TableDebuggerProps {
  dogsStatus: DogCareStatus[];
  selectedCategory: string;
}

const TableDebugger: React.FC<TableDebuggerProps> = ({ dogsStatus, selectedCategory }) => {
  useEffect(() => {
    console.log(`🐕 TableDebugger rendering with ${dogsStatus.length} dogs`);
    console.log('🐕 Selected category:', selectedCategory);
    
    if (dogsStatus.length > 0) {
      console.log('🐕 First dog object:', JSON.stringify(dogsStatus[0]).substring(0, 200) + '...');
    } else {
      console.warn('⚠️ No dogs available in DogCareTable');
    }
  }, [dogsStatus, selectedCategory]);

  return null; // This component doesn't render anything
};

export default TableDebugger;
