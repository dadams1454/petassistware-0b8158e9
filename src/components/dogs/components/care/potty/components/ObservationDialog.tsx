
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageCircle, Activity, Heart } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { DogCareStatus } from '@/types/dailyCare';

export type ObservationType = 'accident' | 'heat' | 'behavior' | 'other';

interface ObservationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedDog: DogCareStatus | null;
  observationType: ObservationType;
  setObservationType: (type: ObservationType) => void;
  observationNote: string;
  setObservationNote: (note: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const ObservationDialog: React.FC<ObservationDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedDog,
  observationType,
  setObservationType,
  observationNote,
  setObservationNote,
  onSubmit,
  isLoading = false
}) => {
  const isMobile = useIsMobile();

  // Dialog content is the same for both mobile and desktop
  const observationDialogContent = (
    <>
      <div className="space-y-4 mt-2">
        <div>
          <Label htmlFor="observation-type">Observation Type</Label>
          <RadioGroup 
            value={observationType} 
            onValueChange={(value) => setObservationType(value as ObservationType)}
            className="flex flex-wrap gap-4 mt-2"
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
          <Label htmlFor="observation">Observation Notes</Label>
          <Textarea
            id="observation"
            value={observationNote}
            onChange={(e) => setObservationNote(e.target.value)}
            placeholder="Enter your observation (e.g., 'Dog had an accident in kennel' or 'Showing early signs of heat')"
            className="mt-1"
            rows={4}
          />
        </div>
      </div>
      
      <div className={`mt-4 ${isMobile ? 'flex justify-end gap-2' : ''}`}>
        {isMobile ? (
          <>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={onSubmit}
              disabled={!observationNote.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </>
        ) : (
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={onSubmit}
              disabled={!observationNote.trim() || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Observation'}
            </Button>
          </DialogFooter>
        )}
      </div>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="h-auto max-h-[85vh] pb-10">
            <SheetHeader className="mb-4">
              <SheetTitle>Observation for {selectedDog?.dog_name}</SheetTitle>
            </SheetHeader>
            {observationDialogContent}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Daily Observation for {selectedDog?.dog_name}</DialogTitle>
            </DialogHeader>
            {observationDialogContent}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ObservationDialog;
