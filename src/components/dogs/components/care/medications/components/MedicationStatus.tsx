
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { MedicationStatusResult, MedicationStatus } from '@/types/health';
import { isComplexStatus, getStatusValue } from '@/utils/medicationUtils';

interface MedicationStatusDisplayProps {
  status: string | MedicationStatusResult | MedicationStatus;
  statusColor?: string;
  label?: string;
  isLoading?: boolean;
}

const MedicationStatusDisplay: React.FC<MedicationStatusDisplayProps> = ({ 
  status, 
  statusColor,
  label,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // Get display text and color
  let displayText = '';
  let displayColor = statusColor || '';
  
  if (isComplexStatus(status)) {
    displayText = status.statusLabel || getStatusValue(status);
    displayColor = statusColor || status.statusColor;
  } else if (typeof status === 'object' && status !== null) {
    // Handle MedicationStatus objects (without statusLabel)
    displayText = status.status.charAt(0).toUpperCase() + status.status.slice(1);
    displayColor = statusColor || status.statusColor;
  } else if (typeof status === 'string') {
    // Simple string status
    displayText = status.charAt(0).toUpperCase() + status.slice(1);
  }
  
  // Override display text with explicit label if provided
  if (label) {
    displayText = label;
  }

  return (
    <Badge className={displayColor || "bg-gray-200 text-gray-700"}>
      {displayText}
    </Badge>
  );
};

export default MedicationStatusDisplay;
