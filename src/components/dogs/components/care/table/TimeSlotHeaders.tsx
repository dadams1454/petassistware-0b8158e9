
import React from 'react';
import { TableHead } from '@/components/ui/table';

interface TimeSlotHeadersProps {
  timeSlots: string[];
  currentHour?: number;
}

const TimeSlotHeaders: React.FC<TimeSlotHeadersProps> = ({ 
  timeSlots,
  currentHour 
}) => {
  return (
    <>
      <TableHead className="w-40 sticky left-0 z-10 bg-muted/50">Dog Name</TableHead>
      {timeSlots.map((timeSlot) => {
        // Extract the hour from the time slot (e.g., "6:00 AM" → 6)
        const hourMatch = timeSlot.match(/^(\d+):/);
        const hour = hourMatch ? parseInt(hourMatch[1]) : null;
        const isPM = timeSlot.includes('PM');
        
        // Convert to 24-hour format for comparison with currentHour
        let hour24 = hour;
        if (hour && isPM && hour !== 12) hour24 = hour + 12;
        if (hour && !isPM && hour === 12) hour24 = 0;
        
        // Check if this time slot is the current hour
        const isCurrentHour = hour24 === currentHour;
        
        return (
          <TableHead 
            key={timeSlot} 
            className={`text-center p-0 w-12 h-12 border-x border-slate-200 dark:border-slate-700 ${
              isCurrentHour ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="text-xs font-medium leading-tight">
              {timeSlot.replace(':00', '')}
            </div>
          </TableHead>
        );
      })}
    </>
  );
};

export default TimeSlotHeaders;
