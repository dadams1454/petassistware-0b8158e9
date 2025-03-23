
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeSlotSelectorProps {
  timeSlots: string[];
  selectedTimeSlot: string;
  setSelectedTimeSlot: (timeSlot: string) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  timeSlots,
  selectedTimeSlot,
  setSelectedTimeSlot
}) => {
  if (!timeSlots.length) return null;
  
  return (
    <div>
      <Label htmlFor="time-slot">
        When did this occur?
      </Label>
      <Select 
        value={selectedTimeSlot} 
        onValueChange={setSelectedTimeSlot}
      >
        <SelectTrigger id="time-slot" className="w-full">
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {timeSlots.map((slot) => (
            <SelectItem key={slot} value={slot}>
              {slot}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSlotSelector;
