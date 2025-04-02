
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { WeightUnit } from '@/types/health';

interface WeightFormProps {
  puppyId: string;
  onSubmit: (data: any) => Promise<boolean>;
  onCancel: () => void;
  defaultUnit?: WeightUnit;
  birthDate?: string;
  onSuccess?: () => void;
  isSubmitting?: boolean;
}

const WeightForm: React.FC<WeightFormProps> = ({
  puppyId,
  onSubmit,
  onCancel,
  defaultUnit = 'lbs',
  birthDate,
  onSuccess,
  isSubmitting = false
}) => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(defaultUnit);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight || isNaN(parseFloat(weight))) {
      alert('Please enter a valid weight');
      return;
    }
    
    setLocalSubmitting(true);
    
    try {
      const success = await onSubmit({
        puppy_id: puppyId,
        weight: parseFloat(weight),
        weight_unit: weightUnit,
        date,
        notes,
        birth_date: birthDate
      });
      
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting weight:', error);
      alert('Failed to save weight record');
    } finally {
      setLocalSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight-unit">Unit</Label>
          <Select value={weightUnit} onValueChange={(value: WeightUnit) => setWeightUnit(value)}>
            <SelectTrigger id="weight-unit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lbs">Pounds (lbs)</SelectItem>
              <SelectItem value="kg">Kilograms (kg)</SelectItem>
              <SelectItem value="g">Grams (g)</SelectItem>
              <SelectItem value="oz">Ounces (oz)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about this weight measurement"
        />
      </div>
      
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || localSubmitting}>
          {isSubmitting || localSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default WeightForm;
