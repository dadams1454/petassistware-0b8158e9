
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  MedicationStatusEnum, 
  MedicationStatusResult, 
  isDetailedStatus,
  getStatusString
} from '@/types/medication-status';
import { getStatusLabel, ExtendedMedicationStatusEnum } from '@/utils/medicationUtils';

interface MedicationStatusProps {
  status: MedicationStatusResult;
  showLabel?: boolean;
  className?: string;
}

const MedicationStatus: React.FC<MedicationStatusProps> = ({
  status,
  showLabel = true,
  className = '',
}) => {
  const statusValue = getStatusString(status);
  const label = getStatusLabel(status);
  const message = isDetailedStatus(status) ? status.message : '';

  const getVariant = () => {
    switch (statusValue) {
      case MedicationStatusEnum.DUE:
        return 'warning';
      case MedicationStatusEnum.OVERDUE:
        return 'destructive';
      case MedicationStatusEnum.ADMINISTERED:
        return 'success';
      case MedicationStatusEnum.PAUSED:
        return 'outline';
      case MedicationStatusEnum.COMPLETED:
        return 'default';
      case MedicationStatusEnum.PENDING:
        return 'secondary';
      case MedicationStatusEnum.UPCOMING:
        return 'info';
      case ExtendedMedicationStatusEnum.SKIPPED:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getClassNames = () => {
    const baseClass = className || '';
    
    switch (statusValue) {
      case MedicationStatusEnum.DUE:
        return `${baseClass} bg-yellow-100 text-yellow-800 hover:bg-yellow-200`;
      case MedicationStatusEnum.OVERDUE:
        return `${baseClass} bg-red-100 text-red-800 hover:bg-red-200`;
      case MedicationStatusEnum.ADMINISTERED:
        return `${baseClass} bg-green-100 text-green-800 hover:bg-green-200`;
      case MedicationStatusEnum.PAUSED:
        return `${baseClass} bg-gray-100 text-gray-800 hover:bg-gray-200`;
      case MedicationStatusEnum.COMPLETED:
        return `${baseClass} bg-blue-100 text-blue-800 hover:bg-blue-200`;
      case MedicationStatusEnum.PENDING:
        return `${baseClass} bg-purple-100 text-purple-800 hover:bg-purple-200`;
      case MedicationStatusEnum.UPCOMING:
        return `${baseClass} bg-indigo-100 text-indigo-800 hover:bg-indigo-200`;
      case ExtendedMedicationStatusEnum.SKIPPED:
        return `${baseClass} bg-gray-100 text-gray-800 border border-gray-300`;
      case ExtendedMedicationStatusEnum.UNKNOWN:
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <Badge variant={getVariant()} className={getClassNames()}>
      {showLabel ? label : ''}
      {showLabel && message ? ': ' : ''}
      {message}
    </Badge>
  );
};

export default MedicationStatus;
