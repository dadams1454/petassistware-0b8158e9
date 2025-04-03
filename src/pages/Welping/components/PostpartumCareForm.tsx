
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface PostpartumCareFormProps {
  litterId: string;
}

const PostpartumCareForm: React.FC<PostpartumCareFormProps> = ({ litterId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Create a new postpartum care record
      const { error } = await supabase
        .from('postpartum_care')
        .insert({
          litter_id: litterId,
          date: data.date || format(new Date(), 'yyyy-MM-dd'),
          dam_temperature: parseFloat(data.dam_temperature) || null,
          dam_appetite: data.dam_appetite,
          dam_hydration: data.dam_hydration,
          dam_discharge: data.dam_discharge,
          dam_milk_production: data.dam_milk_production,
          dam_behavior: data.dam_behavior,
          puppies_nursing: data.puppies_nursing === 'true',
          all_puppies_nursing: data.all_puppies_nursing === 'true',
          puppy_weights_recorded: data.puppy_weights_recorded === 'true',
          weight_concerns: data.weight_concerns,
          notes: data.notes,
          performed_by: data.performed_by || 'Staff'
        });
      
      if (error) throw error;
      
      toast.success('Postpartum care record saved successfully!');
    } catch (error) {
      console.error('Error saving postpartum care record:', error);
      toast.error('Failed to save postpartum care record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Postpartum Care Record</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date"
                defaultValue={format(new Date(), 'yyyy-MM-dd')}
                {...register('date')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="performed_by">Performed By</Label>
              <Input 
                id="performed_by" 
                type="text"
                {...register('performed_by')}
              />
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Dam Health</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dam_temperature">Temperature (°F)</Label>
                <Input 
                  id="dam_temperature" 
                  type="number"
                  step="0.1"
                  {...register('dam_temperature')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dam_appetite">Appetite</Label>
                <Select onValueChange={(value) => setValue('dam_appetite', value)}>
                  <SelectTrigger id="dam_appetite">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="decreased">Decreased</SelectItem>
                    <SelectItem value="increased">Increased</SelectItem>
                    <SelectItem value="not_eating">Not Eating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dam_hydration">Hydration</Label>
                <Select onValueChange={(value) => setValue('dam_hydration', value)}>
                  <SelectTrigger id="dam_hydration">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="dehydrated">Dehydrated</SelectItem>
                    <SelectItem value="overhydrated">Overhydrated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dam_discharge">Discharge</Label>
                <Select onValueChange={(value) => setValue('dam_discharge', value)}>
                  <SelectTrigger id="dam_discharge">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="abnormal">Abnormal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dam_milk_production">Milk Production</Label>
                <Select onValueChange={(value) => setValue('dam_milk_production', value)}>
                  <SelectTrigger id="dam_milk_production">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dam_behavior">Behavior</Label>
                <Select onValueChange={(value) => setValue('dam_behavior', value)}>
                  <SelectTrigger id="dam_behavior">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="anxious">Anxious</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                    <SelectItem value="lethargic">Lethargic</SelectItem>
                    <SelectItem value="distressed">Distressed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Puppies</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="puppies_nursing" 
                  onCheckedChange={(checked) => 
                    setValue('puppies_nursing', checked ? 'true' : 'false')
                  }
                />
                <Label htmlFor="puppies_nursing">Puppies are nursing</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="all_puppies_nursing" 
                  onCheckedChange={(checked) => 
                    setValue('all_puppies_nursing', checked ? 'true' : 'false')
                  }
                />
                <Label htmlFor="all_puppies_nursing">All puppies nursing well</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="puppy_weights_recorded" 
                  onCheckedChange={(checked) => 
                    setValue('puppy_weights_recorded', checked ? 'true' : 'false')
                  }
                />
                <Label htmlFor="puppy_weights_recorded">Puppy weights recorded</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight_concerns">Weight Concerns</Label>
                <Textarea 
                  id="weight_concerns" 
                  placeholder="Note any concerns about puppy weights"
                  {...register('weight_concerns')}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea 
              id="notes" 
              {...register('notes')}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PostpartumCareForm;
