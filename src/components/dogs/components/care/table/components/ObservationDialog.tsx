
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dog, MessageCircle } from 'lucide-react';

interface ObservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  dogName: string;
  onSubmit: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other') => Promise<void>;
  existingObservations?: Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>;
}

const ObservationDialog: React.FC<ObservationDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  dogName,
  onSubmit,
  existingObservations = []
}) => {
  const [observation, setObservation] = useState('');
  const [observationType, setObservationType] = useState<'accident' | 'heat' | 'behavior' | 'other'>('other');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observation.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(dogId, observation, observationType);
      setObservation('');
      setObservationType('other');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>Daily Observation for {dogName}</span>
          </DialogTitle>
        </DialogHeader>
        
        {existingObservations.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Current Observations (Last 24 hours)</h3>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {existingObservations.map((obs, index) => (
                <div 
                  key={index} 
                  className="p-2 bg-muted rounded-md text-sm"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium capitalize">{obs.observation_type}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(obs.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p>{obs.observation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="observation-type">Observation Type</Label>
              <RadioGroup 
                value={observationType} 
                onValueChange={(value) => setObservationType(value as any)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accident" id="accident" />
                  <Label htmlFor="accident">Accident</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="heat" id="heat" />
                  <Label htmlFor="heat">Heat Signs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="behavior" id="behavior" />
                  <Label htmlFor="behavior">Behavior</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="observation">Observation Notes</Label>
              <Textarea
                id="observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Enter your observation (e.g., 'Dog had an accident in kennel' or 'Showing early signs of heat')"
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ObservationDialog;
