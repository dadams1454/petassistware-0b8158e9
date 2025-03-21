
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  activeCategory = 'pottybreaks'
}) => {
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
              {activeCategory === 'feeding' 
                ? 'Which meal was missed or had issues?' 
                : 'When did this occur?'
              }
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
        
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="observation">
              {activeCategory === 'feeding' 
                ? 'Feeding Notes (Optional)'
                : 'Observation Notes (Optional)'
              }
            </Label>
            <span className="text-xs text-muted-foreground">
              {timeSlot ? `Time slot: ${timeSlot}` : timestamp ? `Time: ${timestamp}` : ''}
            </span>
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
