
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface WelpingRecordFormProps {
  onSuccess: (litter: any) => void;
}

const WelpingRecordForm: React.FC<WelpingRecordFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dogs, setDogs] = useState<any[]>([]);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  
  React.useEffect(() => {
    const fetchDogs = async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Female')
        .filter('is_pregnant', 'eq', true);
      
      if (!error && data) {
        setDogs(data);
      }
    };
    
    fetchDogs();
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Create a new litter record
      const { data: litter, error } = await supabase
        .from('litters')
        .insert({
          dam_id: data.dam_id,
          birth_date: data.birth_date || format(new Date(), 'yyyy-MM-dd'),
          status: 'Whelping',
          litter_name: data.litter_name,
          male_count: parseInt(data.male_count) || 0,
          female_count: parseInt(data.female_count) || 0
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Welping record created successfully!');
      onSuccess(litter);
    } catch (error) {
      console.error('Error creating welping record:', error);
      toast.error('Failed to create welping record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Welping Record</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dam_id">Select Dam</Label>
            <Select onValueChange={(value) => setValue('dam_id', value)}>
              <SelectTrigger id="dam_id">
                <SelectValue placeholder="Select a dam" />
              </SelectTrigger>
              <SelectContent>
                {dogs.map((dog) => (
                  <SelectItem key={dog.id} value={dog.id}>
                    {dog.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dam_id && <p className="text-red-500 text-sm">Dam selection is required</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="litter_name">Litter Name</Label>
            <Input 
              id="litter_name" 
              type="text"
              {...register('litter_name', { required: 'Litter name is required' })}
            />
            {errors.litter_name && (
              <p className="text-red-500 text-sm">{errors.litter_name.message as string}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birth_date">Birth Date</Label>
            <Input 
              id="birth_date" 
              type="date"
              defaultValue={format(new Date(), 'yyyy-MM-dd')}
              {...register('birth_date')}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="male_count">Male Puppies</Label>
              <Input 
                id="male_count" 
                type="number"
                min={0}
                defaultValue={0}
                {...register('male_count')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="female_count">Female Puppies</Label>
              <Input 
                id="female_count" 
                type="number"
                min={0}
                defaultValue={0}
                {...register('female_count')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              {...register('notes')}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Welping Record'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WelpingRecordForm;
