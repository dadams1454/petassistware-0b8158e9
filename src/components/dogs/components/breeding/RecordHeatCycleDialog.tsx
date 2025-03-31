
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Heart } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useHeatCycleAlerts } from '@/hooks/breeding/useHeatCycleAlerts';
import { useToast } from '@/components/ui/use-toast';

interface RecordHeatCycleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dog: any;
  onSuccess: () => void;
}

const RecordHeatCycleDialog: React.FC<RecordHeatCycleDialogProps> = ({ 
  isOpen, 
  onClose,
  dog,
  onSuccess
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { recordHeatDate } = useHeatCycleAlerts([]);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select a heat cycle start date",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await recordHeatDate(dog.id, date);
      
      if (success) {
        toast({
          title: "Heat Cycle Recorded",
          description: `${dog.name}'s heat cycle has been recorded successfully.`
        });
        onSuccess();
        onClose();
      } else {
        throw new Error("Failed to record heat cycle");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record heat cycle. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Record Heat Cycle
          </DialogTitle>
          <DialogDescription>
            Record the start date of {dog?.name}'s heat cycle.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="heat-date" className="text-sm font-medium">
              Heat Cycle Start Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="heat-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordHeatCycleDialog;
