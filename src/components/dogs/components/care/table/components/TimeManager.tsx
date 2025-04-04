
import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { MedicationFrequency } from '@/utils/medicationUtils';

interface TimeManagerProps {
  frequency: string;
  lastTime?: string;
  showFrequency?: boolean;
}

const TimeManager: React.FC<TimeManagerProps> = ({ 
  frequency, 
  lastTime,
  showFrequency = true
}) => {
  const getTimeSlots = () => {
    switch (frequency) {
      case MedicationFrequency.TWICE_DAILY:
        return ['morning', 'evening'];
      case MedicationFrequency.THREE_TIMES_DAILY:
        return ['morning', 'afternoon', 'evening'];
      case MedicationFrequency.MONTHLY:
        return ['beginning of month'];
      default:
        return ['anytime'];
    }
  };

  const formatTime = (time: string) => {
    try {
      return format(new Date(time), 'h:mm a');
    } catch (e) {
      return 'Invalid time';
    }
  };

  return (
    <div className="flex flex-col text-xs">
      {lastTime && (
        <div className="flex items-center text-muted-foreground mb-1">
          <Clock className="h-3 w-3 mr-1" />
          {formatTime(lastTime)}
        </div>
      )}
      {showFrequency && (
        <div className="text-muted-foreground">
          {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
        </div>
      )}
    </div>
  );
};

export default TimeManager;
