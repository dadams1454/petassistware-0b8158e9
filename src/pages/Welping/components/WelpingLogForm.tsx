
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WelpingLogFormProps {
  litterId: string;
  onSave: (data: any) => Promise<void>;
}

const WelpingLogForm: React.FC<WelpingLogFormProps> = ({ litterId, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      eventType: 'note',
      notes: '',
      puppyDetails: {
        gender: '',
        color: '',
        weight: ''
      }
    }
  });
  
  const eventType = form.watch('eventType');
  const showPuppyDetails = eventType === 'puppy_born';
  
  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Format data for API
      const currentTime = new Date().toISOString();
      
      const logEntry = {
        timestamp: currentTime,
        event_type: data.eventType,
        notes: data.notes,
        puppy_details: showPuppyDetails ? {
          gender: data.puppyDetails.gender,
          color: data.puppyDetails.color,
          weight: data.puppyDetails.weight
        } : undefined
      };
      
      await onSave(logEntry);
      
      // Reset form
      form.reset({
        eventType: 'note',
        notes: '',
        puppyDetails: {
          gender: '',
          color: '',
          weight: ''
        }
      });
    } catch (error) {
      console.error('Error saving log entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="start">Start of Whelping</SelectItem>
                  <SelectItem value="contraction">Contraction</SelectItem>
                  <SelectItem value="puppy_born">Puppy Born</SelectItem>
                  <SelectItem value="end">End of Whelping</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {showPuppyDetails && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-md">
            <h4 className="text-sm font-medium">Puppy Details</h4>
            
            <FormField
              control={form.control}
              name="puppyDetails.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="puppyDetails.color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Puppy color" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="puppyDetails.weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (oz)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.1" placeholder="0.0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Add any additional information" 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Event'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WelpingLogForm;
