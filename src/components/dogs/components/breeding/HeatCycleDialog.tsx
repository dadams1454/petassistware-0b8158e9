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

interface HeatCycleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  dogId: string;
  onSubmit: (values: {
    id: string;
    dog_id: string;
    start_date: string;
    end_date: string;
    intensity: HeatIntensityType;
    symptoms: string[];
    notes: string;
    created_at: string;
    cycle_number: number;
  }) => Promise<void>;
  existingCycle?: {
    id: string;
    dog_id: string;
    start_date: string;
    end_date: string;
    intensity: HeatIntensityType;
    symptoms: string[];
    notes: string;
    created_at: string;
  };
}

const HeatCycleDialog: React.FC<HeatCycleDialogProps> = ({
  open,
  setOpen,
  dogId,
  onSubmit,
  existingCycle
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(existingCycle ? parseISO(existingCycle.start_date) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(existingCycle ? parseISO(existingCycle.end_date) : undefined);
  const [intensity, setIntensity] = useState<HeatIntensityType>(existingCycle ? existingCycle.intensity : 'none');
  const [symptoms, setSymptoms] = useState<string[]>(existingCycle ? existingCycle.symptoms : []);
  const [notes, setNotes] = useState(existingCycle ? existingCycle.notes : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingCycle) {
      setStartDate(parseISO(existingCycle.start_date));
      setEndDate(parseISO(existingCycle.end_date));
      setIntensity(existingCycle.intensity);
      setSymptoms(existingCycle.symptoms);
      setNotes(existingCycle.notes);
    } else {
      // Reset form when opening for a new cycle
      setStartDate(undefined);
      setEndDate(undefined);
      setIntensity('none');
      setSymptoms([]);
      setNotes('');
    }
  }, [existingCycle, open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const startDateString = startDate ? format(startDate, 'yyyy-MM-dd') : '';
    const endDateString = endDate ? format(endDate, 'yyyy-MM-dd') : '';

    try {
      await onSubmit({
        id: existingCycle?.id || '',
        dog_id: dogId,
        start_date: startDateString,
        end_date: endDateString,
        intensity: intensity,
        symptoms: symptoms,
        notes: notes,
        created_at: new Date().toISOString(),
        cycle_number: 1  // Add this default value for the required property
      });
      setOpen(false);
    } catch (error) {
      console.error("Error submitting heat cycle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingCycle ? "Edit Heat Cycle" : "Add Heat Cycle"}</DialogTitle>
          <DialogDescription>
            {existingCycle ? "Update the heat cycle details." : "Enter the details for the new heat cycle."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker
                id="startDate"
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
                id="endDate"
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
            <Select value={intensity} onValueChange={setIntensity}>
              <SelectTrigger id="intensity">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                {HeatIntensityValues.map((intensity) => (
                  <SelectItem key={intensity} value={intensity}>
                    {intensity}
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
