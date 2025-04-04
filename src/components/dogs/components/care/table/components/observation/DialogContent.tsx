
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ObservationType } from '../../hooks/pottyBreakHooks/observationTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertCircle, 
  Activity, 
  Thermometer, 
  Heart, 
  Pill, 
  Clock, 
  Flag,
  Weight
} from 'lucide-react';

interface DialogContentProps {
  existingObservations?: Array<{
    observation: string;
    observation_type: ObservationType;
    created_at: string;
    category?: string;
  }>;
  observation: string;
  setObservation: (observation: string) => void;
  observationType: ObservationType;
  setObservationType: (type: ObservationType) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  observationDate: Date;
  setObservationDate: (date: Date) => void;
  timeSlot?: string;
  timeSlots?: string[];
  selectedTimeSlot?: string;
  setSelectedTimeSlot?: (timeSlot: string) => void;
  isMobile?: boolean;
  activeCategory?: string;
}

const observationTypeOptions: { value: ObservationType; label: string; icon: React.ReactNode }[] = [
  { value: 'health', label: 'Health Issue', icon: <Thermometer className="h-4 w-4" /> },
  { value: 'behavior', label: 'Behavior', icon: <AlertCircle className="h-4 w-4" /> },
  { value: 'activity', label: 'Activity', icon: <Activity className="h-4 w-4" /> },
  { value: 'medication', label: 'Medication', icon: <Pill className="h-4 w-4" /> },
  { value: 'feeding', label: 'Feeding', icon: <Clock className="h-4 w-4" /> },
  { value: 'weight', label: 'Weight', icon: <Weight className="h-4 w-4" /> },
  { value: 'milestone', label: 'Milestone', icon: <Flag className="h-4 w-4" /> },
  { value: 'other', label: 'Other', icon: <Heart className="h-4 w-4" /> },
];

const DialogContent: React.FC<DialogContentProps> = ({
  existingObservations = [],
  observation,
  setObservation,
  observationType,
  setObservationType,
  onSubmit,
  isSubmitting,
  onCancel,
  observationDate,
  setObservationDate,
  timeSlot,
  timeSlots = [],
  selectedTimeSlot,
  setSelectedTimeSlot,
  isMobile = false,
  activeCategory = 'other'
}) => {
  // Filter observation types based on the active category
  const filteredObservationTypes = React.useMemo(() => {
    if (activeCategory === 'feeding') {
      return observationTypeOptions.filter(opt => 
        ['feeding', 'behavior', 'health', 'other'].includes(opt.value)
      );
    } 
    if (activeCategory === 'medications') {
      return observationTypeOptions.filter(opt => 
        ['medication', 'health', 'behavior', 'other'].includes(opt.value)
      );
    }
    if (activeCategory === 'exercise') {
      return observationTypeOptions.filter(opt => 
        ['activity', 'behavior', 'health', 'other'].includes(opt.value)
      );
    }
    if (activeCategory === 'pottybreaks') {
      return observationTypeOptions.filter(opt => 
        ['health', 'behavior', 'other'].includes(opt.value)
      );
    }
    // Return all options for other categories
    return observationTypeOptions;
  }, [activeCategory]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Time slot selection if available */}
      {timeSlots && timeSlots.length > 0 && setSelectedTimeSlot && (
        <div className="space-y-2">
          <Label htmlFor="timeSlot">Time Slot</Label>
          <Select
            value={selectedTimeSlot || timeSlot || timeSlots[0]}
            onValueChange={setSelectedTimeSlot}
          >
            <SelectTrigger id="timeSlot">
              <SelectValue placeholder="Select time slot" />
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

      {/* Observation type selection */}
      <div className="space-y-2">
        <Label htmlFor="observationType">Observation Type</Label>
        <Select
          value={observationType}
          onValueChange={(value) => setObservationType(value as ObservationType)}
        >
          <SelectTrigger id="observationType">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {filteredObservationTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  {type.icon}
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Observation text area */}
      <div className="space-y-2">
        <Label htmlFor="observation">Observation</Label>
        <Textarea
          id="observation"
          placeholder="Enter observation details..."
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      {/* Show existing observations */}
      {existingObservations.length > 0 && (
        <div className="space-y-2 mt-4">
          <h3 className="text-sm font-medium">Previous Observations</h3>
          <div className="rounded-md border overflow-y-auto max-h-[200px]">
            {existingObservations.map((obs, index) => {
              // Find the icon for this observation type
              const typeInfo = observationTypeOptions.find(
                (t) => t.value === obs.observation_type
              );
              
              return (
                <div
                  key={index}
                  className="p-3 text-sm border-b last:border-b-0"
                >
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-muted p-1 flex-shrink-0">
                      {typeInfo?.icon || <AlertCircle className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground flex justify-between">
                        <span>{obs.observation_type}</span>
                        <span>
                          {format(new Date(obs.created_at), 'MMM d, h:mm a')}
                        </span>
                      </p>
                      <p className="mt-1 break-words">{obs.observation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save Observation"}
        </Button>
      </div>
    </form>
  );
};

export default DialogContent;
