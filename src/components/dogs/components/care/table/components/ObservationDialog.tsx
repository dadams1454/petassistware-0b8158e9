
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageCircle, AlertTriangle, Activity, Heart } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { CustomButton } from '@/components/ui/custom-button';

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
  timeSlot?: string;
  isMobile?: boolean;
}

const ObservationDialog: React.FC<ObservationDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  dogName,
  onSubmit,
  existingObservations = [],
  timeSlot = '',
  isMobile = false
}) => {
  const [observation, setObservation] = useState('');
  const [observationType, setObservationType] = useState<'accident' | 'heat' | 'behavior' | 'other'>('other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timestamp, setTimestamp] = useState<string>('');

  // Update the timestamp whenever the dialog opens
  useEffect(() => {
    if (open) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTimestamp(timeString);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observation.trim()) return;
    
    // Add timestamp to observation if provided
    const observationWithTimestamp = timestamp 
      ? `[${timestamp}] ${observation}` 
      : observation;
    
    setIsSubmitting(true);
    try {
      await onSubmit(dogId, observationWithTimestamp, observationType);
      setObservation('');
      setObservationType('other');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get the icon based on observation type
  const getObservationTypeIcon = (type: 'accident' | 'heat' | 'behavior' | 'other') => {
    switch (type) {
      case 'accident':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'heat':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'behavior':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // The form content is the same for both mobile and desktop
  const dialogContent = (
    <>
      {existingObservations.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Current Observations (Last 24 hours)</h3>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {existingObservations.map((obs, index) => (
              <div 
                key={index} 
                className="p-2 bg-muted rounded-md text-sm"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium capitalize flex items-center gap-1">
                    {getObservationTypeIcon(obs.observation_type)}
                    {obs.observation_type}
                  </span>
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
              className={`flex ${isMobile ? 'flex-wrap' : ''} gap-4 mt-2`}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="accident" id="accident" />
                <Label htmlFor="accident" className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Accident
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="heat" id="heat" />
                <Label htmlFor="heat" className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  Heat Signs
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="behavior" id="behavior" />
                <Label htmlFor="behavior" className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Behavior
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-gray-500" />
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>
          
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
        
        <div className={`mt-4 ${isMobile ? 'flex justify-end gap-2' : ''}`}>
          {isMobile ? (
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
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
            </>
          ) : (
            <DialogFooter>
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
          )}
        </div>
      </form>
    </>
  );
  
  // Use regular Dialog on desktop, Sheet on mobile
  return isMobile ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85vh] overflow-auto pb-10">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>Observation for {dogName}</span>
          </SheetTitle>
        </SheetHeader>
        {dialogContent}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>Daily Observation for {dogName}</span>
          </DialogTitle>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default ObservationDialog;
