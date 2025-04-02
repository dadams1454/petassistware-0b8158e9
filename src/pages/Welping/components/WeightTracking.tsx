
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Puppy } from '@/types/litter';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface WeightTrackingProps {
  puppyId: string;
  puppyName: string;
  onWeightAdded?: () => void;
}

const WeightTracking: React.FC<WeightTrackingProps> = ({ puppyId, puppyName, onWeightAdded }) => {
  const { toast } = useToast();
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('oz');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [puppyWeights, setPuppyWeights] = useState<any[]>([]);
  
  React.useEffect(() => {
    fetchPuppyWeights();
  }, [puppyId]);
  
  const fetchPuppyWeights = async () => {
    const { data, error } = await supabase
      .from('weight_records')
      .select('*')
      .eq('puppy_id', puppyId)
      .order('date', { ascending: false });
      
    if (!error && data) {
      setPuppyWeights(data);
    }
  };
  
  const handleAddWeight = async () => {
    if (!weight || isNaN(Number(weight))) {
      toast({
        title: 'Invalid weight',
        description: 'Please enter a valid weight number',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the weight record
      const { data, error } = await supabase
        .from('weight_records')
        .insert({
          puppy_id: puppyId,
          weight: Number(weight),
          weight_unit: weightUnit,
          date: new Date().toISOString(),
        })
        .select();
        
      if (error) throw error;
      
      // Also update the current weight on the puppy record
      await supabase
        .from('puppies')
        .update({ current_weight: weight })
        .eq('id', puppyId);
      
      toast({
        title: 'Weight recorded',
        description: `Successfully recorded ${weight} ${weightUnit} for ${puppyName}`,
      });
      
      // Clear the form
      setWeight('');
      
      // Refresh the weight list
      fetchPuppyWeights();
      
      // Notify parent component
      if (onWeightAdded) onWeightAdded();
      
    } catch (error) {
      console.error('Error recording weight:', error);
      toast({
        title: 'Error',
        description: 'Failed to record weight',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weight Tracking</CardTitle>
        <CardDescription>Record and monitor {puppyName}'s weight</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
            />
          </div>
          <div className="w-24">
            <Label htmlFor="unit">Unit</Label>
            <select
              id="unit"
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
            >
              <option value="oz">oz</option>
              <option value="g">g</option>
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
          <Button 
            onClick={handleAddWeight}
            disabled={isSubmitting}
            className="ml-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        {/* Weight History */}
        <div className="mt-4">
          <h4 className="font-medium mb-2">Weight History</h4>
          
          {puppyWeights.length === 0 ? (
            <p className="text-sm text-muted-foreground">No weight records found</p>
          ) : (
            <div className="border rounded-md">
              <div className="grid grid-cols-3 gap-2 font-medium text-sm p-2 border-b">
                <div>Date</div>
                <div>Weight</div>
                <div>Unit</div>
              </div>
              {puppyWeights.map((record) => (
                <div key={record.id} className="grid grid-cols-3 gap-2 text-sm p-2 border-b last:border-0">
                  <div>{format(new Date(record.date), 'MMM d, yyyy')}</div>
                  <div>{record.weight}</div>
                  <div>{record.weight_unit}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightTracking;
