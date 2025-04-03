
import React from 'react';
import { Loader2 } from 'lucide-react';
import { MedicationHeaderProps } from '../types/medicationTypes';

const MedicationHeader: React.FC<MedicationHeaderProps> = ({ 
  title, 
  description, 
  isLoading = false 
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {isLoading && (
          <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default MedicationHeader;
