
import React from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Check, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { MedicationStatus as MedicationStatusType, MedicationStatusEnum, MedicationStatusResult } from '@/types/health';
import { getStatusLabel } from '@/utils/medicationUtils';

interface MedicationStatusProps {
  status: MedicationStatusResult | MedicationStatusType | MedicationStatusEnum | string | null;
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
  let statusValue: MedicationStatusEnum = MedicationStatusEnum.Unknown;
  let statusObject: MedicationStatusResult | null = null;
  let nextDueDate: string | Date | null = nextDue;
  
  if (typeof status === 'object' && status !== null && 'status' in status) {
    // Handle MedicationStatusResult
    statusObject = status as MedicationStatusResult;
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
      switch (status) {
        case 'active': statusValue = MedicationStatusEnum.Active; break;
        case 'overdue': statusValue = MedicationStatusEnum.Overdue; break;
        case 'discontinued': statusValue = MedicationStatusEnum.Discontinued; break;
        case 'upcoming': 
        case 'scheduled': statusValue = MedicationStatusEnum.Scheduled; break;
        case 'not_started': statusValue = MedicationStatusEnum.NotStarted; break;
        case 'completed': statusValue = MedicationStatusEnum.Completed; break;
        default: statusValue = MedicationStatusEnum.Unknown;
      }
    }
  }
  
  // Get status label and color
  const { statusLabel, statusColor } = getStatusLabel(statusValue);
  
  // Determine the icon based on status
  const getIcon = () => {
    switch (statusValue) {
      case MedicationStatusEnum.Active:
        return <Check className="h-4 w-4 text-green-500" />;
      case MedicationStatusEnum.Overdue:
      case MedicationStatusEnum.Discontinued:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case MedicationStatusEnum.Scheduled:
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case MedicationStatusEnum.NotStarted:
        return <Clock className="h-4 w-4 text-gray-500" />;
      case MedicationStatusEnum.Completed:
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
