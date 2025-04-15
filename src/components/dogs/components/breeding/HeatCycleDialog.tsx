
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeatIntensityType, HeatIntensityValues } from '@/types';
import { Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

export interface HeatCycleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onOpenChange?: (open: boolean) => void;
  dogId?: string;
  cycle: any | null;
  onSubmit?: (values: any) => Promise<void>;
  onSave?: (values: any) => Promise<void>;
  existingCycle?: any;
}

const HeatCycleDialog: React.FC<HeatCycleDialogProps> = ({
  open,
  setOpen,
  onOpenChange,
  dogId,
  cycle,
  onSubmit,
  onSave,
  existingCycle
}) => {
  const cycleData = cycle || existingCycle;
  const dogIdentifier = dogId || (cycleData ? cycleData.dog_id : '');
  
  const [startDate, setStartDate] = useState<Date | undefined>(cycleData && cycleData.start_date ? 
    (typeof cycleData.start_date === 'string' ? parseISO(cycleData.start_date) : cycleData.start_date) : undefined);
  
  const [endDate, setEndDate] = useState<Date | undefined>(cycleData && cycleData.end_date ? 
    (typeof cycleData.end_date === 'string' ? parseISO(cycleData.end_date) : cycleData.end_date) : undefined);
  
  const [intensity, setIntensity] = useState<HeatIntensityType>(cycleData ? cycleData.intensity : 'none');
  const [symptoms, setSymptoms] = useState<string[]>(cycleData ? cycleData.symptoms : []);
  const [notes, setNotes] = useState(cycleData ? cycleData.notes : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cycleData) {
      setStartDate(typeof cycleData.start_date === 'string' ? parseISO(cycleData.start_date) : cycleData.start_date);
      setEndDate(cycleData.end_date ? (typeof cycleData.end_date === 'string' ? parseISO(cycleData.end_date) : cycleData.end_date) : undefined);
      setIntensity(cycleData.intensity);
      setSymptoms(cycleData.symptoms || []);
      setNotes(cycleData.notes || '');
    } else {
      // Reset form when opening for a new cycle
      setStartDate(undefined);
      setEndDate(undefined);
      setIntensity('none');
      setSymptoms([]);
      setNotes('');
    }
  }, [cycleData, open]);

  const handleDialogChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    setOpen(newOpen);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const startDateString = startDate ? format(startDate, 'yyyy-MM-dd') : '';
    const endDateString = endDate ? format(endDate, 'yyyy-MM-dd') : '';

    try {
      const cycleData = {
        id: cycle?.id || existingCycle?.id || '',
        dog_id: dogIdentifier,
        start_date: startDateString,
        end_date: endDateString,
        intensity: intensity,
        symptoms: symptoms,
        notes: notes,
        created_at: new Date().toISOString(),
        cycle_number: cycle?.cycle_number || existingCycle?.cycle_number || 1
      };

      if (onSave) {
        await onSave(cycleData);
      } else if (onSubmit) {
        await onSubmit(cycleData);
      }
      handleDialogChange(false);
    } catch (error) {
      console.error("Error submitting heat cycle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIntensityChange = (value: string) => {
    setIntensity(value as HeatIntensityType);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{cycleData ? "Edit Heat Cycle" : "Add Heat Cycle"}</DialogTitle>
          <DialogDescription>
            {cycleData ? "Update the heat cycle details." : "Enter the details for the new heat cycle."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                placeholder="Select date"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <DatePicker
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                placeholder="Select date"
                className="w-full"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="intensity">Intensity</Label>
            <Select value={intensity} onValueChange={handleIntensityChange}>
              <SelectTrigger id="intensity">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                {HeatIntensityValues.map((intensity) => (
                  <SelectItem key={intensity} value={intensity}>
                    {intensity.charAt(0).toUpperCase() + intensity.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="symptoms">Symptoms</Label>
            <Input
              type="text"
              id="symptoms"
              value={symptoms.join(', ')}
              onChange={(e) => setSymptoms(e.target.value.split(',').map(s => s.trim()))}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              type="text"
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HeatCycleDialog;
