
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MedicationStatus as MedicationStatusEnum } from '@/utils/medicationUtils';

interface MedicationStatusDisplayProps {
  status: MedicationStatusEnum | 'incomplete' | 'current' | 'due_soon' | 'overdue';
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
      case MedicationStatusEnum.Active:
        return 'Active';
      case MedicationStatusEnum.Completed:
        return 'Complete';
      case MedicationStatusEnum.Upcoming:
        return 'Upcoming';
      case MedicationStatusEnum.Expired:
        return 'Expired';
      case MedicationStatusEnum.Missed:
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
