
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MedicationStatus } from '@/utils/medicationUtils';

interface MedicationStatusDisplayProps {
  status: MedicationStatus | 'incomplete';
  statusColor: string;
  label?: string;
}

const MedicationStatusDisplay: React.FC<MedicationStatusDisplayProps> = ({ 
  status, 
  statusColor,
  label
}) => {
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
