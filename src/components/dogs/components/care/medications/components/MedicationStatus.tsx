
import React from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Check, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { MedicationStatus as MedicationStatusEnum, MedicationStatusResult } from '@/types/health';
import { getStatusLabel } from '@/utils/medicationUtils';

interface MedicationStatusProps {
  status: MedicationStatusResult | MedicationStatusEnum | string | null;
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
  
  // Convert string status to MedicationStatusEnum if needed
  const statusValue = typeof status === 'object' && status !== null && 'status' in status
    ? (status as MedicationStatusResult).status
    : status as MedicationStatusEnum;
  
  const { statusLabel, statusColor } = getStatusLabel(statusValue);
  
  // Determine the icon based on status
  const getIcon = () => {
    switch (String(statusValue)) {
      case 'active':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'upcoming':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Determine the next due date to display
  const nextDueDate = nextDue ||
    (typeof status === 'object' && status !== null && 'nextDue' in status ? 
      (status as MedicationStatusResult).nextDue : null);
  
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
