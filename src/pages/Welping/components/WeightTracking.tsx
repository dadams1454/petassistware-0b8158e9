
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WeightUnit } from '@/types/common';
import { toast } from '@/hooks/use-toast';

interface WeightTrackingProps {
  puppyId: string;
  refreshData?: () => void;
}

const WeightTracking: React.FC<WeightTrackingProps> = ({ puppyId, refreshData }) => {
  const [weight, setWeight] = useState<number | ''>('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('oz');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveWeight = async () => {
    if (weight === '' || isNaN(Number(weight)) || Number(weight) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid weight",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const weightData = {
        dog_id: puppyId, // Required field
        puppy_id: puppyId,
        weight: Number(weight),
        weight_unit: weightUnit,
        unit: weightUnit, // Set both for compatibility
        date: new Date().toISOString().split('T')[0]
      };

      const { error } = await supabase
        .from('weight_records')
        .insert(weightData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Weight recorded successfully",
      });

      setWeight('');
      if (refreshData) refreshData();
    } catch (error) {
      console.error('Error saving weight:', error);
      toast({
        title: "Error",
        description: "Failed to save weight",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Weight Tracking</CardTitle>
        <CardDescription>Record puppy's weight</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-end gap-2">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : '')}
                step="0.1"
                min="0"
              />
            </div>
            <div className="grid w-2/5 gap-1.5">
              <Label htmlFor="weight-unit">Unit</Label>
              <Select 
                value={weightUnit} 
                onValueChange={(value) => setWeightUnit(value as WeightUnit)}
              >
                <SelectTrigger id="weight-unit">
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oz">Ounces (oz)</SelectItem>
                  <SelectItem value="g">Grams (g)</SelectItem>
                  <SelectItem value="lb">Pounds (lb)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleSaveWeight} 
              disabled={isSubmitting}
              className="ml-2"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightTracking;
