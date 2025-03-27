
import React from 'react';
import { format, isValid } from 'date-fns';
import { Clock } from 'lucide-react';
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
  const formatDate = (date: string | null): string => {
    if (!date) return 'Never';
    
    try {
      const dateObj = new Date(date);
      return isValid(dateObj) ? format(dateObj, 'MMM d, yyyy') : 'No date recorded';
    } catch (e) {
      return 'No date recorded';
    }
  };

  return (
    <div className="mt-3 pt-2 border-t text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center">
        <Clock className="h-3 w-3 mr-1 text-gray-400" />
        <span>Last Medication: {name}</span>
      </div>
      <div className="flex justify-between mt-1">
        <span>Administered: {formatDate(lastAdministered || null)}</span>
        <span>Frequency: {formatMedicationFrequency(frequency)}</span>
      </div>
    </div>
  );
};

export default LastMedicationInfo;
