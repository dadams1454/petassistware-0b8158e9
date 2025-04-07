
import React from 'react';
import { formatDistance, formatDistanceToNow, isPast, isToday, parseISO } from 'date-fns';
import { MedicationFrequencyConstants } from '@/utils/medicationUtils';

interface TimeManagerProps {
  frequency: string;
  lastTime: string;
  showFrequency?: boolean;
  formatType?: 'short' | 'long';
}

const TimeManager: React.FC<TimeManagerProps> = ({
  frequency,
  lastTime,
  showFrequency = true,
  formatType = 'short'
}) => {
  const parsedLastTime = parseISO(lastTime);
  const lastTimePast = isPast(parsedLastTime);
  const lastTimeToday = isToday(parsedLastTime);
  
  const getDueTime = () => {
    let dueIn: string;
    
    // For frequency handling
    let nextDue: Date = new Date(parsedLastTime);
    
    switch (frequency) {
      case MedicationFrequencyConstants.DAILY:
        nextDue.setDate(nextDue.getDate() + 1);
        break;
      case MedicationFrequencyConstants.ONCE_DAILY:
        nextDue.setDate(nextDue.getDate() + 1);
        break;
      case MedicationFrequencyConstants.TWICE_DAILY:
        nextDue.setHours(nextDue.getHours() + 12);
        break;
      case MedicationFrequencyConstants.THREE_TIMES_DAILY:
        nextDue.setHours(nextDue.getHours() + 8);
        break;
      case MedicationFrequencyConstants.EVERY_OTHER_DAY:
        nextDue.setDate(nextDue.getDate() + 2);
        break;
      case MedicationFrequencyConstants.WEEKLY:
        nextDue.setDate(nextDue.getDate() + 7);
        break;
      case MedicationFrequencyConstants.BIWEEKLY:
        nextDue.setDate(nextDue.getDate() + 14);
        break;
      case MedicationFrequencyConstants.MONTHLY:
        nextDue.setMonth(nextDue.getMonth() + 1);
        break;
      case MedicationFrequencyConstants.QUARTERLY:
        nextDue.setMonth(nextDue.getMonth() + 3);
        break;
      case MedicationFrequencyConstants.ANNUALLY:
        nextDue.setFullYear(nextDue.getFullYear() + 1);
        break;
      default:
        nextDue.setDate(nextDue.getDate() + 1); // Default to daily
    }
    
    const isPastDue = isPast(nextDue);
    
    if (isPastDue) {
      dueIn = formatType === 'short' 
        ? `Past due (${formatDistance(nextDue, new Date(), { addSuffix: false })})`
        : `Past due by ${formatDistance(nextDue, new Date(), { addSuffix: false })}`;
    } else {
      dueIn = formatType === 'short'
        ? `Due ${formatDistanceToNow(nextDue, { addSuffix: true })}`
        : `Due in ${formatDistanceToNow(nextDue, { addSuffix: false })}`;
    }
    
    return dueIn;
  };
  
  const getElapsedTime = () => {
    if (lastTimeToday) {
      return 'Today';
    }
    return formatType === 'short'
      ? formatDistanceToNow(parsedLastTime, { addSuffix: true })
      : `${formatDistanceToNow(parsedLastTime, { addSuffix: false })} ago`;
  };
  
  return (
    <div className="flex flex-col">
      <div className="text-sm font-medium">
        {getElapsedTime()}
      </div>
      {showFrequency && (
        <div className="text-xs text-muted-foreground">
          {getDueTime()}
        </div>
      )}
    </div>
  );
};

export default TimeManager;
