
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { HeatCycle, HeatIntensity } from '@/types/reproductive';

export interface RecordHeatCycleDialogProps {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  dogId: string;
  editData?: HeatCycle | null;
}

const RecordHeatCycleDialog: React.FC<RecordHeatCycleDialogProps> = ({
  open = false,
  onOpenChange = () => {},
  dogId,
  editData = null
}) => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(
    editData?.start_date ? new Date(editData.start_date) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    editData?.end_date ? new Date(editData.end_date) : undefined
  );
  const [notes, setNotes] = useState(editData?.notes || '');
  const [intensity, setIntensity] = useState<HeatIntensity | null>(editData?.intensity || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when edit data changes
  useEffect(() => {
    if (editData) {
      setStartDate(editData.start_date ? new Date(editData.start_date) : new Date());
      setEndDate(editData.end_date ? new Date(editData.end_date) : undefined);
      setNotes(editData.notes || '');
      setIntensity(editData.intensity || null);
    } else {
      setStartDate(new Date());
      setEndDate(undefined);
      setNotes('');
      setIntensity(null);
    }
  }, [editData]);

  const handleSubmit = async () => {
    if (!startDate) {
      toast({
        title: "Error",
        description: "Start date is required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const heatCycleData = {
        dog_id: dogId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate ? endDate.toISOString().split('T')[0] : null,
        notes: notes.trim() || null,
        intensity: intensity
      };

      let result;

      if (editData?.id) {
        // Update existing record
        result = await supabase
          .from('heat_cycles')
          .update(heatCycleData)
          .eq('id', editData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('heat_cycles')
          .insert(heatCycleData);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: editData?.id
          ? "Heat cycle updated successfully"
          : "Heat cycle recorded successfully"
      });

      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error saving heat cycle:', error);
      toast({
        title: "Error",
        description: "Failed to save heat cycle data",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Heat Cycle" : "Record Heat Cycle"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">End Date (Leave blank if still in heat)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => date < (startDate || new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Intensity</label>
            <div className="flex space-x-2">
              <Button 
                variant={intensity === 'mild' ? "default" : "outline"}
                onClick={() => setIntensity('mild')}
                size="sm"
              >
                Mild
              </Button>
              <Button 
                variant={intensity === 'moderate' ? "default" : "outline"}
                onClick={() => setIntensity('moderate')}
                size="sm"
              >
                Moderate
              </Button>
              <Button 
                variant={intensity === 'strong' ? "default" : "outline"}
                onClick={() => setIntensity('strong')}
                size="sm"
              >
                Strong
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any observations or notes"
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordHeatCycleDialog;
