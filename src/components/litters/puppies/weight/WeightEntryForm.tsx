
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
import { WeightUnit, weightUnitInfos } from '@/types/common';
import { WeightRecord } from '@/types/puppyTracking';

interface WeightEntryFormProps {
  puppyId: string;
  birthDate?: string;
  onSave: (data: WeightRecord) => void;
  onCancel: () => void;
  initialData?: Partial<WeightRecord>;
}

const WeightEntryForm: React.FC<WeightEntryFormProps> = ({
  puppyId,
  birthDate,
  onSave,
  onCancel,
  initialData
}) => {
  const [weight, setWeight] = useState(initialData?.weight?.toString() || '');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    initialData?.weight_unit || 'oz'
  );
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate age in days if birthDate is provided
  const calculateAgeDays = (): number | undefined => {
    if (!birthDate || !date) return undefined;
    
    const birth = new Date(birthDate);
    const weightDate = new Date(date);
    
    // Calculate difference in milliseconds and convert to days
    const diffTime = Math.abs(weightDate.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight || isNaN(parseFloat(weight))) {
      alert('Please enter a valid weight');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const weightRecord: WeightRecord = {
        id: initialData?.id || crypto.randomUUID(),
        puppy_id: puppyId,
        weight: parseFloat(weight),
        weight_unit: weightUnit,
        date,
        notes: notes || '',
        created_at: initialData?.created_at || new Date().toISOString()
      };
      
      // Add age_days if birthDate is available
      if (birthDate) {
        weightRecord.age_days = calculateAgeDays();
      }
      
      onSave(weightRecord);
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
          <Label htmlFor="weight">Weight*</Label>
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
          <Label htmlFor="weight-unit">Unit*</Label>
          <Select value={weightUnit} onValueChange={(value: WeightUnit) => setWeightUnit(value)}>
            <SelectTrigger id="weight-unit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(weightUnitInfos).map(([unitCode, unitInfo]) => (
                <SelectItem key={unitCode} value={unitCode}>
                  {unitInfo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date*</Label>
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
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default WeightEntryForm;
