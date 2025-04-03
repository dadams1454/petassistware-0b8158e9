
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { MedicationStatusDisplayProps } from '../types/medicationTypes';
import { isComplexStatus, getStatusValue } from '@/utils/medicationUtils';

const MedicationStatusDisplay: React.FC<MedicationStatusDisplayProps> = ({ 
  status, 
  statusColor,
  label,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // Get display text based on status
  let displayText = '';
  
  if (isComplexStatus(status)) {
    displayText = status.statusLabel || getStatusValue(status);
  } else {
    displayText = status.charAt(0).toUpperCase() + status.slice(1);
  }
  
  // Allow overriding the display text with a label prop
  if (label) {
    displayText = label;
  }

  return (
    <Badge className={statusColor}>
      {displayText}
    </Badge>
  );
};

export default MedicationStatusDisplay;
