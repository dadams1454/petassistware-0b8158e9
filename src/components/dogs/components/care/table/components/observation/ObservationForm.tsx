
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import ObservationTypeSelector from './ObservationTypeSelector';
import { ObservationType } from './ObservationDialog';

interface ObservationFormProps {
  observation: string;
  setObservation: (value: string) => void;
  observationType: ObservationType;
  setObservationType: (type: ObservationType) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  timestamp: string;
  timeSlot?: string;
  timeSlots?: string[];
  selectedTimeSlot?: string;
  setSelectedTimeSlot?: (timeSlot: string) => void;
  isMobile?: boolean;
  activeCategory?: string;
  observationDate: Date;
  setObservationDate: (date: Date) => void;
}

const ObservationForm: React.FC<ObservationFormProps> = ({
  observation,
  setObservation,
  observationType,
  setObservationType,
  onSubmit,
  isSubmitting,
  onCancel,
  timestamp,
  timeSlot = '',
  timeSlots = [],
  selectedTimeSlot = '',
  setSelectedTimeSlot = () => {},
  isMobile = false,
  activeCategory = 'pottybreaks',
  observationDate,
  setObservationDate
}) => {
  const [timeInput, setTimeInput] = useState(() => {
    const hours = observationDate.getHours();
    const minutes = observationDate.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  // Update time input when observation date changes
  useEffect(() => {
    const hours = observationDate.getHours();
    const minutes = observationDate.getMinutes();
    setTimeInput(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  }, [observationDate]);

  // Get placeholder text based on observation type and category
  const getPlaceholderText = () => {
    if (activeCategory === 'feeding') {
      return "Optional details about the missed meal or feeding issue";
    }
    
    return "Optional details about the observation";
  };
  
  // Get button text based on category
  const getSubmitButtonText = () => {
    if (activeCategory === 'feeding') {
      return isSubmitting ? 'Saving...' : 'Record Feeding Issue';
    }
    
    return isSubmitting ? 'Saving...' : 'Save Observation';
  };

  // Generate human-readable time slot text
  const getTimeSlotText = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
  };

  // Handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value);
    
    // Update the date object with the new time
    if (e.target.value) {
      const [hours, minutes] = e.target.value.split(':').map(Number);
      const newDate = new Date(observationDate);
      if (!isNaN(hours) && !isNaN(minutes)) {
        newDate.setHours(hours, minutes);
        setObservationDate(newDate);
      }
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      // Preserve the current time
      const hours = observationDate.getHours();
      const minutes = observationDate.getMinutes();
      newDate.setHours(hours, minutes);
      setObservationDate(newDate);
    }
  };

  // Format time for display
  const formatTimeForDisplay = (date: Date) => {
    return format(date, 'h:mm a');
  };

  // Set the "When did this occur?" field to use the current time slot
  useEffect(() => {
    if (timeSlots.length > 0 && !selectedTimeSlot) {
      setSelectedTimeSlot(getTimeSlotText());
    }
  }, [timeSlots, selectedTimeSlot, setSelectedTimeSlot]);
  
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        {/* Show type selector only for potty breaks, not for feeding */}
        {activeCategory !== 'feeding' && (
          <ObservationTypeSelector 
            value={observationType} 
            onChange={setObservationType} 
            isMobile={isMobile}
          />
        )}
        
        {/* Time slot selector when available */}
        {timeSlots.length > 0 && setSelectedTimeSlot && (
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
        )}

        {/* Simplified Date and Time selector in a single row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="observation-date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="observation-date"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !observationDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(observationDate, 'MMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={observationDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  defaultMonth={observationDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="observation-time">Time</Label>
            <Button
              variant="outline"
              id="observation-time"
              className="w-full justify-start text-left font-normal"
              onClick={() => {
                // Use current time on click
                const now = new Date();
                const newDate = new Date(observationDate);
                newDate.setHours(now.getHours(), now.getMinutes());
                setObservationDate(newDate);
              }}
            >
              <Clock className="mr-2 h-4 w-4" />
              {formatTimeForDisplay(observationDate)}
            </Button>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="observation">
              {activeCategory === 'feeding' 
                ? 'Feeding Notes (Optional)'
                : 'Observation Notes (Optional)'
              }
            </Label>
          </div>
          <Textarea
            id="observation"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder={getPlaceholderText()}
            className="mt-1"
            rows={isMobile ? 3 : 4}
          />
        </div>
      </div>
      
      {isMobile ? (
        <div className="mt-4 flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1"
          >
            {getSubmitButtonText()}
          </Button>
        </div>
      ) : (
        <DialogFooter className="mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {getSubmitButtonText()}
          </Button>
        </DialogFooter>
      )}
    </form>
  );
};

export default ObservationForm;
