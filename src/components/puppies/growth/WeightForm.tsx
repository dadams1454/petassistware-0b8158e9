
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWeightData } from '@/hooks/useWeightData';
import { WeightUnit } from '@/types/health';

interface WeightFormProps {
  puppyId: string;
  birthDate?: string;
  onCancel: () => void;
  onSuccess?: () => void;
  defaultUnit?: WeightUnit;
}

const WeightForm: React.FC<WeightFormProps> = ({ 
  puppyId, 
  birthDate,
  onCancel,
  onSuccess,
  defaultUnit = 'oz'
}) => {
  const [weight, setWeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(defaultUnit);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addWeightRecord } = useWeightData(puppyId);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight || !date) {
      alert('Please enter weight and date');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addWeightRecord({
        weight: parseFloat(weight),
        weight_unit: weightUnit,
        date,
        notes,
        birth_date: birthDate
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Reset form
        setWeight('');
        setDate(new Date().toISOString().split('T')[0]);
        setNotes('');
      }
    } catch (error) {
      console.error('Error adding weight record:', error);
      alert('Failed to save weight record');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Weight</CardTitle>
      </CardHeader>
      <CardContent>
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
              <Select value={weightUnit} onValueChange={(value) => setWeightUnit(value as WeightUnit)}>
                <SelectTrigger id="weight-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oz">Ounces (oz)</SelectItem>
                  <SelectItem value="g">Grams (g)</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
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
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes about this weight measurement"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Weight'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WeightForm;
