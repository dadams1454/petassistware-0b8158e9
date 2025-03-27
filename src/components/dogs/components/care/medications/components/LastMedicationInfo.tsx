
import React from 'react';
import { Clock } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { MedicationFrequency } from '@/types/medication';
import { formatMedicationFrequency } from '@/utils/medicationUtils';

interface LastMedicationInfoProps {
  name: string;
  lastAdministered?: string;
  frequency: MedicationFrequency;
}

const LastMedicationInfo: React.FC<LastMedicationInfoProps> = ({
  name,
  lastAdministered,
  frequency
}) => {
  const formattedDate = React.useMemo(() => {
    if (!lastAdministered) return "Never administered";
    
    try {
      const date = parseISO(lastAdministered);
      if (!isValid(date)) return "Invalid date";
      
      return format(date, "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  }, [lastAdministered]);
  
  return (
    <div className="pt-3 mt-3 border-t text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" />
        <span>Last: {name}</span>
      </div>
      <div className="flex justify-between items-center mt-1">
        <span>{formattedDate}</span>
        <span>{formatMedicationFrequency(frequency)}</span>
      </div>
    </div>
  );
};

export default LastMedicationInfo;
