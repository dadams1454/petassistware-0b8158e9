import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MedicationStatus, isComplexStatus, getStatusValue } from '@/utils/medicationUtils';
import { MedicationStatusDisplayProps } from '../types/medicationTypes';

const MedicationStatusDisplay: React.FC<MedicationStatusDisplayProps> = ({ 
  status, 
  statusColor,
  label,
  isLoading = false
}) => {
  if (isLoading) {
    return <Skeleton className="h-6 w-20" />;
  }

  // If it's a complex status object, extract the status string
  const statusText = isComplexStatus(status) 
    ? status.status
    : typeof status === 'string' 
      ? status 
      : 'Unknown';

  // Format the status text for display
  const formattedStatus = (() => {
    // If it's a simple string like 'incomplete', just capitalize it
    if (typeof status === 'string') {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    // Otherwise, handle the known enum values
    switch (statusText) {
      case MedicationStatus.Current:
        return 'Current';
      case MedicationStatus.Due:
        return 'Due';
      case MedicationStatus.Overdue:
        return 'Overdue';
      case MedicationStatus.Upcoming:
        return 'Upcoming';
      case MedicationStatus.Completed:
        return 'Completed';
      case MedicationStatus.Active:
        return 'Active';
      case MedicationStatus.Expired:
        return 'Expired';
      case MedicationStatus.Missed:
        return 'Missed';
      default:
        return 'Unknown';
    }
  })();

  // Add additional info for overdue or due soon medications
  const additionalInfo = (() => {
    if (!isComplexStatus(status)) return null;
    
    if (status.status === MedicationStatus.Overdue && status.daysOverdue) {
      return ` (${status.daysOverdue} days)`;
    }
    
    if ((status.status === MedicationStatus.Current || status.status === MedicationStatus.Upcoming) 
        && status.daysUntilDue) {
      return ` (in ${status.daysUntilDue} days)`;
    }
    
    return null;
  })();

  return (
    <Badge className={statusColor}>
      {label ? `${label}: ` : ''}
      {formattedStatus}
      {additionalInfo}
    </Badge>
  );
};

export default MedicationStatusDisplay;
