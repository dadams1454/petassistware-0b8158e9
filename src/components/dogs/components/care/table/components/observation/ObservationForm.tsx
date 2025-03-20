
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ObservationTypeSelector from './ObservationTypeSelector';

interface ObservationFormProps {
  observation: string;
  setObservation: (value: string) => void;
  observationType: 'accident' | 'heat' | 'behavior' | 'other';
  setObservationType: (type: 'accident' | 'heat' | 'behavior' | 'other') => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  timestamp: string;
  timeSlot?: string;
  timeSlots?: string[];
  selectedTimeSlot?: string;
  setSelectedTimeSlot?: (timeSlot: string) => void;
  isMobile?: boolean;
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
  isMobile = false
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <ObservationTypeSelector 
          value={observationType} 
          onChange={setObservationType} 
          isMobile={isMobile}
        />
        
        {/* Time slot selector when available */}
        {timeSlots.length > 0 && setSelectedTimeSlot && (
          <div>
            <Label htmlFor="time-slot">When did this occur?</Label>
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
        
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="observation">Observation Notes</Label>
            <span className="text-xs text-muted-foreground">
              {timeSlot ? `Time slot: ${timeSlot}` : timestamp ? `Current time: ${timestamp}` : ''}
            </span>
          </div>
          <Textarea
            id="observation"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Enter your observation (e.g., 'Dog had an accident in kennel' or 'Showing early signs of heat')"
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
            disabled={!observation.trim() || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
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
            disabled={!observation.trim() || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Observation'}
          </Button>
        </DialogFooter>
      )}
    </form>
  );
};

export default ObservationForm;
