
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WelpingObservation } from '@/types/welping';
import { format } from 'date-fns';

// Define the schema for the form validation
const observationSchema = z.object({
  observation_type: z.string().min(1, 'Observation type is required'),
  description: z.string().min(1, 'Description is required'),
  observation_time: z.string().min(1, 'Observation time is required'),
  puppy_id: z.string().optional(),
  action_taken: z.string().optional()
});

interface ObservationFormProps {
  welpingRecordId: string;
  onSave: (data: Partial<WelpingObservation>) => Promise<void>;
  puppyOptions?: { id: string; name: string }[];
  onCancel?: () => void;
}

const ObservationForm: React.FC<ObservationFormProps> = ({ 
  welpingRecordId, 
  onSave, 
  puppyOptions = [],
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<z.infer<typeof observationSchema>>({
    resolver: zodResolver(observationSchema),
    defaultValues: {
      observation_time: format(new Date(), 'HH:mm')
    }
  });
  
  const onSubmit = async (data: z.infer<typeof observationSchema>) => {
    setIsSubmitting(true);
    try {
      // Prepare the data to match WelpingObservation type requirements
      const observationData: WelpingObservation = {
        welping_record_id: welpingRecordId,
        observation_type: data.observation_type,
        observation_time: data.observation_time,
        description: data.description,
        puppy_id: data.puppy_id || undefined,
        action_taken: data.action_taken || undefined,
        created_at: new Date().toISOString()
      };
      
      await onSave(observationData);
      reset();
    } catch (error) {
      console.error('Failed to save observation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Observation</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observation_type">Observation Type</Label>
            <Select 
              onValueChange={(value) => setValue('observation_type', value)} 
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Select observation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="contractions">Contractions</SelectItem>
                <SelectItem value="discharge">Discharge</SelectItem>
                <SelectItem value="behavior">Behavior</SelectItem>
                <SelectItem value="feeding">Feeding</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="puppy_check">Puppy Check</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.observation_type && (
              <p className="text-red-500 text-sm">{errors.observation_type.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observation_time">Time</Label>
            <Input id="observation_time" type="time" {...register('observation_time')} />
            {errors.observation_time && (
              <p className="text-red-500 text-sm">{errors.observation_time.message}</p>
            )}
          </div>
          
          {puppyOptions && puppyOptions.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="puppy_id">Puppy (optional)</Label>
              <Select onValueChange={(value) => setValue('puppy_id', value)} defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Select puppy (if applicable)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {puppyOptions.map((puppy) => (
                    <SelectItem key={puppy.id} value={puppy.id}>
                      {puppy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="action_taken">Action Taken (optional)</Label>
            <Textarea id="action_taken" {...register('action_taken')} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Record Observation'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ObservationForm;
