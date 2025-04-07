
import React from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Check, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { MedicationStatusEnum, MedicationStatusResult } from '@/types';
import { getStatusLabel } from '@/utils/medicationUtils';

interface MedicationStatusProps {
  status: MedicationStatusEnum | MedicationStatusResult | string | null;
  nextDue?: string | Date | null;
  showIcon?: boolean;
  showLabel?: boolean;
  showNextDue?: boolean;
}

const MedicationStatus: React.FC<MedicationStatusProps> = ({
  status,
  nextDue,
  showIcon = true,
  showLabel = true,
  showNextDue = false
}) => {
  if (!status) return null;
  
  // Helper function to calculate time until next dose
  const getTimeUntilNextDose = (date: Date | string) => {
    const nextDueDate = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    
    const days = differenceInDays(nextDueDate, today);
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Tomorrow';
    } else if (days > 1) {
      return `In ${days} days`;
    } else {
      return `${Math.abs(days)} days ago`;
    }
  };
  
  // Convert different status types to a standard string
  let statusValue: MedicationStatusEnum = MedicationStatusEnum.UNKNOWN;
  let statusObject: any = null;
  let nextDueDate: string | Date | null = nextDue;
  
  if (typeof status === 'object' && status !== null && 'status' in status) {
    // Handle MedicationStatusResult
    statusObject = status;
    statusValue = statusObject.status;
    if (!nextDueDate && statusObject.nextDue) {
      nextDueDate = statusObject.nextDue;
    }
  } else if (typeof status === 'string') {
    // Handle status as string (or enum)
    if (Object.values(MedicationStatusEnum).includes(status as MedicationStatusEnum)) {
      statusValue = status as MedicationStatusEnum;
    } else {
      // Try to map legacy string status to enum
      switch (status.toLowerCase()) {
        case 'active': statusValue = MedicationStatusEnum.DUE; break;
        case 'overdue': statusValue = MedicationStatusEnum.OVERDUE; break;
        case 'discontinued': statusValue = MedicationStatusEnum.SKIPPED; break;
        case 'upcoming': 
        case 'scheduled': statusValue = MedicationStatusEnum.UPCOMING; break;
        case 'not_started': statusValue = MedicationStatusEnum.DUE; break;
        case 'completed': statusValue = MedicationStatusEnum.COMPLETED; break;
        default: statusValue = MedicationStatusEnum.UNKNOWN;
      }
    }
  }
  
  // Get status label and color
  const { statusLabel, statusColor } = getStatusLabel(statusValue);
  
  // Determine the icon based on status
  const getIcon = () => {
    switch (statusValue) {
      case MedicationStatusEnum.DUE:
        return <Check className="h-4 w-4 text-green-500" />;
      case MedicationStatusEnum.OVERDUE:
      case MedicationStatusEnum.SKIPPED:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case MedicationStatusEnum.UPCOMING:
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case MedicationStatusEnum.COMPLETED:
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      {showIcon && getIcon()}
      
      {showLabel && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
          {statusLabel}
        </span>
      )}
      
      {showNextDue && nextDueDate && (
        <span className="text-xs text-muted-foreground">
          {typeof nextDueDate === 'string' ? 
            getTimeUntilNextDose(parseISO(nextDueDate)) : 
            getTimeUntilNextDose(nextDueDate)}
        </span>
      )}
    </div>
  );
};

export default MedicationStatus;
