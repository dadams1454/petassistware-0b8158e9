
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  MedicationStatus as MedicationStatusEnum, 
  MedicationStatusResult,
  isComplexStatus,
  getStatusValue,
  getStatusColor
} from '@/utils/medicationUtils';

interface MedicationStatusDisplayProps {
  status: MedicationStatusResult;
  statusColor?: string;
  showLabel?: boolean;
}

const MedicationStatusDisplay: React.FC<MedicationStatusDisplayProps> = ({ 
  status, 
  statusColor,
  showLabel = true
}) => {
  const getDisplayColor = (): string => {
    if (statusColor) return statusColor;
    
    return getStatusColor(status);
  };

  const getDisplayLabel = (): string => {
    // Get the status value safely using our type guard
    const statusValue = getStatusValue(status);
    
    switch (statusValue) {
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
      className={`whitespace-nowrap ${getDisplayColor()}`}
    >
      {showLabel ? getDisplayLabel() : ''}
    </Badge>
  );
};

export default MedicationStatusDisplay;
