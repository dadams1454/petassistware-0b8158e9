
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { HeatCycle, HeatIntensityValues } from '@/types';

interface HeatCycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cycle: HeatCycle | null;
  onSave: (cycle: HeatCycle) => void;
}

const HeatCycleDialog: React.FC<HeatCycleDialogProps> = ({
  open,
  onOpenChange,
  cycle,
  onSave
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [intensity, setIntensity] = useState<string>('moderate');
  const [notes, setNotes] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Set form values when cycle changes
  useEffect(() => {
    if (cycle) {
      setStartDate(cycle.start_date ? new Date(cycle.start_date) : new Date());
      setEndDate(cycle.end_date ? new Date(cycle.end_date) : undefined);
      setIntensity(cycle.intensity || 'moderate');
      setNotes(cycle.notes || '');
      setSymptoms(cycle.symptoms || []);
    } else {
      // Reset form for new cycle
      setStartDate(new Date());
      setEndDate(undefined);
      setIntensity('moderate');
      setNotes('');
      setSymptoms([]);
    }
  }, [cycle, open]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const heatCycle: HeatCycle = {
      id: cycle?.id || '',
      dog_id: cycle?.dog_id || '',
      start_date: startDate ? format(startDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      intensity: intensity as typeof HeatIntensityValues[number],
      symptoms: symptoms,
      notes: notes,
      created_at: cycle?.created_at || new Date().toISOString()
    };
    
    onSave(heatCycle);
    setIsLoading(false);
  };
  
  const handleSymptomToggle = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{cycle?.id ? 'Edit' : 'Add'} Heat Cycle</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
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
            <Label htmlFor="endDate">End Date (leave empty if still in heat)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
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
            <Label htmlFor="intensity">Intensity</Label>
            <Select 
              value={intensity} 
              onValueChange={setIntensity}
            >
              <SelectTrigger id="intensity">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="strong">Strong</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Symptoms</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="bleeding" 
                  checked={symptoms.includes('bleeding')} 
                  onCheckedChange={() => handleSymptomToggle('bleeding')}
                />
                <label htmlFor="bleeding" className="text-sm">Bleeding</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="swelling" 
                  checked={symptoms.includes('swelling')} 
                  onCheckedChange={() => handleSymptomToggle('swelling')}
                />
                <label htmlFor="swelling" className="text-sm">Swelling</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="behavioral" 
                  checked={symptoms.includes('behavioral')} 
                  onCheckedChange={() => handleSymptomToggle('behavioral')}
                />
                <label htmlFor="behavioral" className="text-sm">Behavioral Changes</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="discharge" 
                  checked={symptoms.includes('discharge')} 
                  onCheckedChange={() => handleSymptomToggle('discharge')}
                />
                <label htmlFor="discharge" className="text-sm">Discharge</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="appetite" 
                  checked={symptoms.includes('appetite')} 
                  onCheckedChange={() => handleSymptomToggle('appetite')}
                />
                <label htmlFor="appetite" className="text-sm">Change in Appetite</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="nesting" 
                  checked={symptoms.includes('nesting')} 
                  onCheckedChange={() => handleSymptomToggle('nesting')}
                />
                <label htmlFor="nesting" className="text-sm">Nesting Behavior</label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this heat cycle"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (cycle?.id ? 'Update' : 'Save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HeatCycleDialog;
