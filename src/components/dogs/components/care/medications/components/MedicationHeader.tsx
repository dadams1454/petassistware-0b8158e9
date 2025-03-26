
import React from 'react';
import { MedicationHeaderProps } from '../types/medicationTypes';
import { Skeleton } from '@/components/ui/skeleton';

const MedicationHeader: React.FC<MedicationHeaderProps> = ({ 
  title, 
  description,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300">{title}</h3>
      <p className="text-sm text-purple-600 dark:text-purple-400">
        {description}
      </p>
    </div>
  );
};

export default MedicationHeader;
