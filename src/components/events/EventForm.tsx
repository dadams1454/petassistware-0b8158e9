
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EVENT_TYPES, NewEvent } from '@/pages/Calendar';
import DatePicker from '@/components/dogs/form/DatePicker';
import { format } from 'date-fns';

interface EventFormProps {
  onSubmit: (data: NewEvent) => void;
  initialData?: NewEvent;
  defaultDate?: Date;
}

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  event_date: z.date({
    required_error: 'Event date is required',
  }),
  event_dateStr: z.string().optional(),
  status: z.enum(['upcoming', 'planned', 'completed', 'cancelled']),
  event_type: z.string().min(1, 'Event type is required'),
});

const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialData, defaultDate }) => {
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      event_date: initialData?.event_date ? new Date(initialData.event_date) : defaultDate,
      event_dateStr: initialData?.event_date 
        ? format(new Date(initialData.event_date), 'MM/dd/yyyy')
        : defaultDate ? format(defaultDate, 'MM/dd/yyyy') : '',
      status: initialData?.status || 'upcoming',
      event_type: initialData?.event_type || '',
    },
  });

  const handleSubmit = (data: z.infer<typeof eventSchema>) => {
    const formattedDate = format(data.event_date, 'yyyy-MM-dd');
    
    onSubmit({
      id: initialData?.id,
      title: data.title,
      description: data.description,
      event_date: formattedDate,
      status: data.status,
      event_type: data.event_type,
    });
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter event description (optional)" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            form={form}
            name="event_date"
            label="Event Date"
          />

          <FormField
            control={form.control}
            name="event_type"
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
                    {EVENT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" className="w-full md:w-auto">
            {initialData ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
