
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dog, Clock, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface PottyBreakDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDogs: { id: string; name: string }[];
  timeSlot: string;
  onSuccess: () => void;
}

const PottyBreakDialog: React.FC<PottyBreakDialogProps> = ({
  open,
  onOpenChange,
  selectedDogs,
  timeSlot,
  onSuccess,
}) => {
  const [takenBy, setTakenBy] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real implementation, this would save to a database
    // For now, we'll just simulate a save with a delay
    setTimeout(() => {
      console.log('Potty break logged:', {
        dogs: selectedDogs,
        timeSlot,
        takenBy,
        notes,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Potty break logged",
        description: `${selectedDogs.map(d => d.name).join(', ')} were taken out at ${timeSlot} by ${takenBy || 'unknown'}`,
      });

      // Reset form and close dialog
      setTakenBy('');
      setNotes('');
      setIsSubmitting(false);
      onSuccess();
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dog className="h-5 w-5" />
            Log Potty Break
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="timeSlot" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Time
            </Label>
            <Input
              id="timeSlot"
              value={timeSlot}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dogs">Dogs</Label>
            <div className="bg-muted rounded-md p-2 min-h-[60px]">
              {selectedDogs.map(dog => (
                <div key={dog.id} className="inline-flex items-center bg-primary/10 rounded-full px-2 py-1 m-1">
                  <Dog className="h-3 w-3 mr-1" />
                  <span className="text-sm">{dog.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="takenBy" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Taken By
            </Label>
            <Input
              id="takenBy"
              value={takenBy}
              onChange={(e) => setTakenBy(e.target.value)}
              placeholder="Who took the dogs out?"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes?"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Potty Break'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PottyBreakDialog;
