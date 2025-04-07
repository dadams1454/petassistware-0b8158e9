
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
import { HeatCycle, HeatIntensityType, HeatIntensityValues } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface RecordHeatCycleDialogProps {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  dogId: string;
  editData?: HeatCycle | null;
  onSuccess?: () => void;
}

const RecordHeatCycleDialog: React.FC<RecordHeatCycleDialogProps> = ({
  open = false,
  onOpenChange = () => {},
  dogId,
  editData = null,
  onSuccess = () => {}
}) => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(
    editData?.start_date ? new Date(editData.start_date) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    editData?.end_date ? new Date(editData.end_date) : undefined
  );
  const [notes, setNotes] = useState(editData?.notes || '');
  const [intensity, setIntensity] = useState<HeatIntensityType>(
    (editData?.intensity as HeatIntensityType) || 'moderate'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateDogLastHeat, setUpdateDogLastHeat] = useState(!editData);

  // Update form when edit data changes
  useEffect(() => {
    if (editData) {
      setStartDate(editData.start_date ? new Date(editData.start_date) : new Date());
      setEndDate(editData.end_date ? new Date(editData.end_date) : undefined);
      setNotes(editData.notes || '');
      setIntensity((editData.intensity as HeatIntensityType) || 'moderate');
      setUpdateDogLastHeat(false);
    } else {
      setStartDate(new Date());
      setEndDate(undefined);
      setNotes('');
      setIntensity('moderate');
      setUpdateDogLastHeat(true);
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
        intensity: intensity,
        cycle_length: endDate && startDate 
          ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) 
          : null
      };

      if (editData?.id) {
        // Update existing cycle
        const { error } = await supabase
          .from('heat_cycles')
          .update(heatCycleData)
          .eq('id', editData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Heat cycle updated successfully"
        });
      } else {
        // Add new cycle
        const { error } = await supabase
          .from('heat_cycles')
          .insert(heatCycleData);

        if (error) throw error;
        
        // Update dog's last heat date if checkbox is checked
        if (updateDogLastHeat) {
          await supabase
            .from('dogs')
            .update({ last_heat_date: heatCycleData.start_date })
            .eq('id', dogId);
        }

        toast({
          title: "Success",
          description: "Heat cycle recorded successfully"
        });
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error saving heat cycle:", error);
      toast({
        title: "Error",
        description: `Failed to save heat cycle: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Heat Cycle" : "Record Heat Cycle"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
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
            <Label htmlFor="endDate">End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="endDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => date < (startDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity</Label>
            <Select 
              value={intensity}
              onValueChange={(value) => setIntensity(value as HeatIntensityType)}
            >
              <SelectTrigger id="intensity">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                {HeatIntensityValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any relevant observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          {!editData && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="updateLastHeat" 
                checked={updateDogLastHeat} 
                onCheckedChange={(checked) => setUpdateDogLastHeat(!!checked)}
              />
              <Label htmlFor="updateLastHeat" className="text-sm">
                Update dog's last heat date
              </Label>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : (editData ? "Update" : "Save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordHeatCycleDialog;
