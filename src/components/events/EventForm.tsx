
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { NewEvent } from '@/pages/Calendar';
import { EventFormData, formatEventData } from './form/types';
import EventDatePicker from './form/EventDatePicker';
import EventTypeSelector from './form/EventTypeSelector';
import StatusSelector from './form/StatusSelector';
import RecurrenceOptions from './form/RecurrenceOptions';

interface EventFormProps {
  onSubmit: (data: NewEvent) => void;
  initialData?: NewEvent;
  defaultDate?: Date;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialData, defaultDate }) => {
  const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(
    initialData?.is_recurring || false
  );
  
  // Convert string dates from initialData to Date objects for the form
  const form = useForm<EventFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      event_date: initialData?.event_date 
        ? new Date(initialData.event_date) 
        : defaultDate || new Date(),
      status: initialData?.status || 'planned',
      event_type: initialData?.event_type || 'Other',
      is_recurring: initialData?.is_recurring || false,
      recurrence_pattern: initialData?.recurrence_pattern || 'none',
      recurrence_end_date: initialData?.recurrence_end_date 
        ? new Date(initialData.recurrence_end_date) 
        : null
    }
  });

  const handleSubmit = (data: EventFormData) => {
    // If not recurring, make sure recurrence fields are cleared
    if (!data.is_recurring) {
      data.recurrence_pattern = 'none';
      data.recurrence_end_date = null;
    }

    // Format dates as strings for the database
    const formattedData = formatEventData(data);
    onSubmit(formattedData);
  };

  const toggleRecurrence = (checked: boolean) => {
    setShowRecurrenceOptions(checked);
    form.setValue('is_recurring', checked);
    if (!checked) {
      form.setValue('recurrence_pattern', 'none');
      form.setValue('recurrence_end_date', null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter event description" 
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

        {/* Recurring event options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_recurring" 
              checked={showRecurrenceOptions}
              onCheckedChange={(checked) => toggleRecurrence(!!checked)}
            />
            <Label htmlFor="is_recurring">This is a recurring event</Label>
          </div>

          {showRecurrenceOptions && (
            <RecurrenceOptions form={form} />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit">
            {initialData ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
