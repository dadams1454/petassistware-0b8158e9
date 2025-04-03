
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MedicationStatus as MedicationStatusEnum } from '@/utils/medicationUtils';

interface MedicationStatusDisplayProps {
  status: MedicationStatusEnum | 'incomplete' | 'current' | 'due_soon' | 'overdue' | {
    status: 'incomplete' | MedicationStatusEnum;
    statusColor: string;
  };
  statusColor?: string;
  showLabel?: boolean;
}

const MedicationStatusDisplay: React.FC<MedicationStatusDisplayProps> = ({ 
  status, 
  statusColor,
  showLabel = true
}) => {
  const getStatusColor = (): string => {
    if (statusColor) return statusColor;
    
    // Handle complex status object
    if (typeof status === 'object' && 'status' in status && 'statusColor' in status) {
      return status.statusColor;
    }
    
    // Default colors based on status
    const statusValue = typeof status === 'object' ? status.status : status;
    
    switch (statusValue) {
      case MedicationStatusEnum.Active:
      case 'current':
        return 'bg-green-100 text-green-800 border-green-300';
      case MedicationStatusEnum.Upcoming:
      case 'due_soon':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case MedicationStatusEnum.Missed:
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      case MedicationStatusEnum.Completed:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case MedicationStatusEnum.Expired:
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'incomplete':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDisplayLabel = () => {
    // Handle complex status object
    const statusValue = typeof status === 'object' && 'status' in status ? status.status : status;
    
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
      className={`whitespace-nowrap ${getStatusColor()}`}
    >
      {showLabel ? getDisplayLabel() : ''}
    </Badge>
  );
};

export default MedicationStatusDisplay;
