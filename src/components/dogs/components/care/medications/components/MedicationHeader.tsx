
import React from 'react';
import { MedicationHeaderProps } from '../types/medicationTypes';
import { SkeletonLoader } from '@/components/ui/standardized';

const MedicationHeader: React.FC<MedicationHeaderProps> = ({ 
  title, 
  description,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <SkeletonLoader variant="text" width="w-3/4" className="h-5" />
        <SkeletonLoader variant="text" width="w-5/6" className="h-4" /> 
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
