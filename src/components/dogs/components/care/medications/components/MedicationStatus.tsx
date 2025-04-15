
import React from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Check, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { MedicationStatusEnum } from '@/types';
import { getStatusLabel } from '@/utils/medicationUtils';

interface MedicationStatusProps {
  status: string | {
    status: string;
    message: string;
    nextDue?: string | Date | null;
    daysOverdue?: number;
    daysUntilDue?: number;
  } | null;
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
  let statusValue: string = 'unknown';
  let statusObject: any = null;
  let nextDueDate: string | Date | null = nextDue;
  
  if (typeof status === 'object' && status !== null && 'status' in status) {
    // Handle complex status object
    statusObject = status;
    statusValue = statusObject.status;
    if (!nextDueDate && statusObject.nextDue) {
      nextDueDate = statusObject.nextDue;
    }
  } else if (typeof status === 'string') {
    // Handle status as string
    statusValue = status;
    
    // Map legacy string status if needed
    if (!Object.values(MedicationStatusEnum).includes(statusValue as any)) {
      switch (status.toLowerCase()) {
        case 'active': statusValue = 'due'; break;
        case 'overdue': statusValue = 'overdue'; break;
        case 'discontinued': statusValue = 'skipped'; break;
        case 'upcoming': 
        case 'scheduled': statusValue = 'upcoming'; break;
        case 'not_started': statusValue = 'due'; break;
        case 'completed': statusValue = 'completed'; break;
        default: statusValue = 'unknown';
      }
    }
  }
  
  // Get status label and color
  const { statusLabel, statusColor } = getStatusLabel(statusValue);
  
  // Determine the icon based on status
  const getIcon = () => {
    switch (statusValue) {
      case 'due':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'overdue':
      case 'skipped':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'upcoming':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'completed':
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
