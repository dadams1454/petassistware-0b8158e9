
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
import { WeightUnit, standardizeWeightUnit, weightUnits } from '@/types/common';

interface WeightFormProps {
  puppyId: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    weight: number;
    weight_unit: WeightUnit;
    date?: string;
    notes?: string;
  };
}

const WeightForm: React.FC<WeightFormProps> = ({
  puppyId,
  onSubmit,
  onCancel,
  initialData
}) => {
  const [weight, setWeight] = useState(initialData?.weight?.toString() || '');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    initialData?.weight_unit ? 
    standardizeWeightUnit(initialData.weight_unit) : 
    'lb'
  );
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight || isNaN(parseFloat(weight))) {
      alert('Please enter a valid weight');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        puppy_id: puppyId,
        weight: parseFloat(weight),
        weight_unit: weightUnit,
        unit: weightUnit, // For compatibility
        date,
        notes
      });
    } catch (error) {
      console.error('Error submitting weight:', error);
      alert('Failed to save weight record');
    } finally {
      setIsSubmitting(false);
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
              {weightUnits.map(unit => (
                <SelectItem key={unit.code} value={unit.code}>
                  {unit.name} ({unit.code})
                </SelectItem>
              ))}
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default WeightForm;
