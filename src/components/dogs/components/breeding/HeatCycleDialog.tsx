
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { HeatCycle, HeatIntensityType, HeatIntensityValues, mapHeatIntensityTypeToDisplay } from '@/types/heat-cycles';

interface HeatCycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  cycleNumber?: number;
  cycle?: HeatCycle;
  onSave: (cycleData: any) => Promise<void>;
}

const HeatCycleDialog: React.FC<HeatCycleDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  cycleNumber = 1,
  cycle,
  onSave,
}) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [intensity, setIntensity] = useState<HeatIntensityType>('moderate');
  const [symptoms, setSymptoms] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (cycle) {
        // If we're editing an existing cycle, populate the form
        setStartDate(new Date(cycle.start_date));
        setEndDate(cycle.end_date ? new Date(cycle.end_date) : null);
        setIntensity(cycle.intensity);
        setSymptoms(cycle.symptoms ? cycle.symptoms.join(', ') : '');
        setNotes(cycle.notes || '');
      } else {
        // Reset form when dialog opens for a new cycle
        setStartDate(new Date());
        setEndDate(null);
        setIntensity('moderate');
        setSymptoms('');
        setNotes('');
      }
    }
  }, [open, cycle]);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      
      const cycleData = {
        dog_id: dogId,
        cycle_number: cycleNumber,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        intensity,
        symptoms: symptoms.split(',').map(s => s.trim()).filter(Boolean),
        notes,
      };
      
      await onSave(cycleData);
      onOpenChange(false);
      
      toast({
        title: 'Success',
        description: 'Heat cycle recorded successfully',
      });
    } catch (error) {
      console.error('Error saving heat cycle:', error);
      toast({
        title: 'Error',
        description: 'Failed to save heat cycle',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{cycle ? 'Edit Heat Cycle' : 'Record Heat Cycle'}</DialogTitle>
          <DialogDescription>
            {cycle ? 'Update heat cycle details' : 'Record a new heat cycle for this dog.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cycle-number" className="text-right">
              Cycle #
            </Label>
            <Input
              id="cycle-number"
              value={cycleNumber}
              className="col-span-3"
              readOnly
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-date" className="text-right">
              Start Date
            </Label>
            <div className="col-span-3">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Select start date"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-date" className="text-right">
              End Date
            </Label>
            <div className="col-span-3">
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Select end date"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="intensity" className="text-right">
              Intensity
            </Label>
            <Select
              value={intensity}
              onValueChange={(value: HeatIntensityType) => setIntensity(value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                {HeatIntensityValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {mapHeatIntensityTypeToDisplay(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="symptoms" className="text-right">
              Symptoms
            </Label>
            <Input
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Swelling, discharge, etc. (comma separated)"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes"
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Cycle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HeatCycleDialog;
