
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EVENT_TYPES, NewEvent, Event } from '@/pages/Calendar';
import { format } from 'date-fns';
import EventTypeSelector from './form/EventTypeSelector';
import EventDatePicker from './form/EventDatePicker';
import StatusSelector from './form/StatusSelector';
import RecurrenceOptions from './form/RecurrenceOptions';

interface EventFormProps {
  onSubmit: (data: NewEvent) => void;
  initialData?: Event;
  defaultDate?: Date;
}

const EventForm: React.FC<EventFormProps> = ({ 
  onSubmit, 
  initialData, 
  defaultDate 
}) => {
  const form = useForm<NewEvent>({
    defaultValues: initialData || {
      title: '',
      description: '',
      event_date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      status: 'planned',
      event_type: EVENT_TYPES[0],
      is_recurring: false,
      recurrence_pattern: null,
      recurrence_end_date: null
    }
  });

  const handleSubmit = (data: NewEvent) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter event description" 
                  className="resize-none" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EventDatePicker form={form} />
          <EventTypeSelector form={form} />
        </div>

        <StatusSelector form={form} />
        
        <RecurrenceOptions form={form} />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">
            {initialData ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
