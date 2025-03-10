
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
import { Repeat } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface EventFormProps {
  onSubmit: (data: NewEvent) => void;
  initialData?: NewEvent;
  defaultDate?: Date;
}

const RECURRENCE_OPTIONS = [
  'none',
  'daily',
  'weekly',
  'biweekly',
  'monthly',
  'quarterly',
  'yearly'
];

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  event_date: z.date({
    required_error: 'Event date is required',
  }),
  event_dateStr: z.string().optional(),
  status: z.enum(['upcoming', 'planned', 'completed', 'cancelled']),
  event_type: z.string().min(1, 'Event type is required'),
  is_recurring: z.boolean().default(false),
  recurrence_pattern: z.string().default('none'),
  recurrence_end_date: z.date().optional().nullable(),
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
      is_recurring: initialData?.is_recurring || false,
      recurrence_pattern: initialData?.recurrence_pattern || 'none',
      recurrence_end_date: initialData?.recurrence_end_date 
        ? new Date(initialData.recurrence_end_date) 
        : null,
    },
  });

  const isRecurring = form.watch('is_recurring');
  
  const handleSubmit = (data: z.infer<typeof eventSchema>) => {
    const formattedDate = format(data.event_date, 'yyyy-MM-dd');
    let formattedEndDate = null;
    
    if (data.is_recurring && data.recurrence_end_date) {
      formattedEndDate = format(data.recurrence_end_date, 'yyyy-MM-dd');
    }
    
    onSubmit({
      id: initialData?.id,
      title: data.title,
      description: data.description,
      event_date: formattedDate,
      status: data.status,
      event_type: data.event_type,
      is_recurring: data.is_recurring,
      recurrence_pattern: data.is_recurring ? data.recurrence_pattern : 'none',
      recurrence_end_date: formattedEndDate,
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

        <div className="space-y-4 pt-2 border-t border-slate-200 mt-2">
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="is_recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center">
                      <Repeat className="h-4 w-4 mr-2" />
                      Recurring Event
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {isRecurring && (
            <div className="space-y-4 pl-4 border-l-2 border-slate-200">
              <FormField
                control={form.control}
                name="recurrence_pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurrence Pattern</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recurrence pattern" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DatePicker
                form={form}
                name="recurrence_end_date"
                label="End Date (Optional)"
                description="Leave empty for indefinite recurrence"
              />
            </div>
          )}
        </div>

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
