
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MedicationStatus } from '@/utils/medicationUtils';
import { MedicationStatusDisplayProps } from '../types/medicationTypes';
import { SkeletonLoader } from '@/components/ui/standardized';

const MedicationStatusDisplay: React.FC<MedicationStatusDisplayProps> = ({ 
  status, 
  statusColor,
  label,
  isLoading = false
}) => {
  if (isLoading) {
    return <SkeletonLoader className="h-5 w-20" />;
  }
  
  const getStatusLabel = () => {
    if (label) return label;
    
    switch (status) {
      case 'incomplete': return 'Not Recorded';
      case 'current': return 'Current';
      case 'due_soon': return 'Due Soon';
      case 'overdue': return 'Overdue';
      default: return 'Unknown';
    }
  };
  
  return (
    <Badge className={statusColor}>
      {getStatusLabel()}
    </Badge>
  );
};

export default MedicationStatusDisplay;
