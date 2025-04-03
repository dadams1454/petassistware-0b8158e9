
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
  status: MedicationStatusResult | string;
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
    
    // Handle both string and complex status objects
    if (typeof status === 'object' && 'statusColor' in status) {
      return status.statusColor;
    }
    
    // For simple status strings or standard MedicationStatusResult
    return getStatusColor(status as MedicationStatusResult);
  };

  const getDisplayLabel = (): string => {
    // Handle complex status object
    if (typeof status === 'object' && 'status' in status) {
      const innerStatus = status.status;
      
      if (innerStatus === 'incomplete') return 'None';
      if (innerStatus === 'current') return 'Current';
      if (innerStatus === 'due_soon') return 'Due Soon';
      if (innerStatus === 'overdue') return 'Overdue';
    }
    
    // Handle simple status values and enum values
    if (typeof status === 'string') {
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
    }
    
    // For other MedicationStatusResult values
    return 'Unknown';
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
