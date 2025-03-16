
import React from 'react';
import { TableHead } from '@/components/ui/table';

interface TimeSlotHeadersProps {
  timeSlots: string[];
}

const TimeSlotHeaders: React.FC<TimeSlotHeadersProps> = ({ timeSlots }) => {
  return (
    <>
      <TableHead className="w-32 sticky left-0 z-10 bg-muted/50">Dog Name</TableHead>
      {timeSlots.map((timeSlot) => (
        <TableHead key={timeSlot} className="text-center px-2 py-1 w-12 border-x border-slate-200">
          {timeSlot}
        </TableHead>
      ))}
    </>
  );
};

export default TimeSlotHeaders;
