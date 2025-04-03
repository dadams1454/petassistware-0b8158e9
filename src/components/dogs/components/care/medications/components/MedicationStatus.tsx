
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MedicationStatus } from '@/utils/medicationUtils';

interface MedicationStatusDisplayProps {
  status: MedicationStatus | 'incomplete' | 'current' | 'due_soon' | 'overdue';
  statusColor: string;
  showLabel?: boolean;
}

const MedicationStatusDisplay: React.FC<MedicationStatusDisplayProps> = ({ 
  status, 
  statusColor,
  showLabel = true
}) => {
  const getDisplayLabel = () => {
    switch (status) {
      case MedicationStatus.Active:
        return 'Active';
      case MedicationStatus.Completed:
        return 'Complete';
      case MedicationStatus.Upcoming:
        return 'Upcoming';
      case MedicationStatus.Expired:
        return 'Expired';
      case MedicationStatus.Missed:
        return 'Missed';
      case 'current':
        return 'Current';
      case 'due_soon':
        return 'Due Soon';
      case 'overdue':
        return 'Overdue';
      case 'incomplete':
        return 'None';
      default:
        return 'Unknown';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`whitespace-nowrap ${statusColor}`}
    >
      {showLabel ? getDisplayLabel() : ''}
    </Badge>
  );
};

export default MedicationStatusDisplay;
