
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WelpingLog } from '@/types/welping';

interface WelpingLogFormProps {
  litterId: string;
  onSave: (data: Partial<WelpingLog>) => Promise<void>;
}

const WelpingLogForm: React.FC<WelpingLogFormProps> = ({ litterId, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  
  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSave({
        litter_id: litterId,
        event_type: data.event_type, // Ensure this is provided
        timestamp: new Date().toISOString(),
        notes: data.notes,
        puppy_id: data.puppy_id
      });
      
      reset();
    } catch (error) {
      console.error('Error saving log:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="event_type">Event Type</Label>
            <Select 
              onValueChange={(value) => setValue('event_type', value)} 
              defaultValue=""
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start of Whelping</SelectItem>
                <SelectItem value="puppy_born">Puppy Born</SelectItem>
                <SelectItem value="complication">Complication</SelectItem>
                <SelectItem value="medication">Medication Given</SelectItem>
                <SelectItem value="dam_check">Dam Check</SelectItem>
                <SelectItem value="break">Break Taken</SelectItem>
                <SelectItem value="feeding">Feeding</SelectItem>
                <SelectItem value="end">End of Whelping</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.event_type && <p className="text-red-500 text-sm">Event type is required</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              {...register('notes')}
              placeholder="Enter any relevant details about this event"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Record Event'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WelpingLogForm;
