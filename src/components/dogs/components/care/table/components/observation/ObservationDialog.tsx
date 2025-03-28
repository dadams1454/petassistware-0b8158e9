
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormEvent, useState } from 'react';

export type ObservationType = 'heat' | 'behavior' | 'other';

interface ObservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  dogName: string;
  onSubmit: (dogId: string, observation: string, observationType: ObservationType, timestamp?: Date) => Promise<void>;
  existingObservations?: Array<{
    observation: string;
    observation_type: ObservationType;
    created_at: string;
    category?: string;
  }>;
  isMobile?: boolean;
  dialogTitle?: string;
}

const ObservationDialog: React.FC<ObservationDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  dogName,
  onSubmit,
  existingObservations = [],
  isMobile = false,
  dialogTitle = 'Observation'
}) => {
  const [observationType, setObservationType] = useState<ObservationType>('other');
  const [observationNote, setObservationNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(dogId, observationNote, observationType);
      setObservationNote('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting observation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Content = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <RadioGroup 
          value={observationType} 
          onValueChange={(value) => setObservationType(value as ObservationType)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="behavior" id="behavior" />
            <Label htmlFor="behavior">Behavior</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="heat" id="heat" />
            <Label htmlFor="heat">Heat</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Textarea
          placeholder="Enter observation notes..."
          value={observationNote}
          onChange={(e) => setObservationNote(e.target.value)}
          rows={4}
          className="w-full"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={!observationNote.trim() || isSubmitting}
        >
          Save Observation
        </Button>
      </div>

      {existingObservations.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-medium mb-2">Recent Observations</h4>
          <div className="space-y-3">
            {existingObservations.map((obs, index) => (
              <div key={index} className="text-sm border-l-2 border-primary pl-3">
                <div className="flex justify-between">
                  <span className="font-medium capitalize">{obs.observation_type}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(obs.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1">{obs.observation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );

  // Use mobile sheet for mobile devices, dialog for desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{dialogTitle} for {dogName}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <Content />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle} for {dogName}</DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
};

export default ObservationDialog;
