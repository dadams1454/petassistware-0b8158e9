
import React from 'react';
import { MedicationHeaderProps } from '../types/medicationTypes';
import { Loader2 } from 'lucide-react';

const MedicationHeader: React.FC<MedicationHeaderProps> = ({ 
  title, 
  count, 
  description,
  isLoading 
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2">
        <h3 className="text-base font-semibold">{title}</h3>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="text-sm text-muted-foreground">({count})</span>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};

export default MedicationHeader;
