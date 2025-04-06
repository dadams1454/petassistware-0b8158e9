
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

interface WelpingObservationFormProps {
  litterId: string;
}

const WelpingObservationForm: React.FC<WelpingObservationFormProps> = ({ litterId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [puppies, setPuppies] = useState<any[]>([]);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  React.useEffect(() => {
    const fetchPuppies = async () => {
      if (!litterId) return;
      
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .eq('litter_id', litterId);
      
      if (!error && data) {
        setPuppies(data);
      }
    };
    
    fetchPuppies();
  }, [litterId]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Create a new welping observation record
      const { error } = await supabase
        .from('welping_observations')
        .insert([{
          welping_record_id: litterId,
          observation_type: data.observation_type, // Required field
          observation_time: data.observation_time || format(new Date(), 'HH:mm:ss'),
          description: data.description, // Required field
          puppy_id: data.puppy_id || null,
          action_taken: data.action_taken || null
        }]);
      
      if (error) throw error;
      
      toast.success('Observation recorded successfully!');
    } catch (error) {
      console.error('Error recording observation:', error);
      toast.error('Failed to record observation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Welping Observation</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observation_type">Observation Type</Label>
            <Select 
              onValueChange={(value) => setValue('observation_type', value)}
              required
            >
              <SelectTrigger id="observation_type">
                <SelectValue placeholder="Select observation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dam_status">Dam Status</SelectItem>
                <SelectItem value="puppy_birth">Puppy Birth</SelectItem>
                <SelectItem value="complication">Complication</SelectItem>
                <SelectItem value="routine_check">Routine Check</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.observation_type && <p className="text-red-500 text-sm">Observation type is required</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observation_time">Time</Label>
            <Input 
              id="observation_time" 
              type="time"
              defaultValue={format(new Date(), 'HH:mm')}
              {...register('observation_time')}
            />
          </div>
          
          {puppies.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="puppy_id">Related Puppy (Optional)</Label>
              <Select onValueChange={(value) => setValue('puppy_id', value)}>
                <SelectTrigger id="puppy_id">
                  <SelectValue placeholder="Select a puppy" />
                </SelectTrigger>
                <SelectContent>
                  {puppies.map((puppy) => (
                    <SelectItem key={puppy.id} value={puppy.id}>
                      {puppy.name || `Puppy #${puppy.birth_order || 'Unknown'}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              {...register('description', { required: 'Description is required' })}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message as string}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="action_taken">Action Taken (Optional)</Label>
            <Textarea 
              id="action_taken" 
              {...register('action_taken')}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Recording...' : 'Record Observation'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WelpingObservationForm;
