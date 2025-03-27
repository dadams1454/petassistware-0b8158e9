
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFeeding } from '@/contexts/feeding';
import { FeedingFormData, FeedingSchedule, FeedingRecord } from '@/types/feeding';
import { useToast } from '@/components/ui/use-toast';

// Form validation schema
const feedingFormSchema = z.object({
  food_type: z.string().min(1, { message: 'Food type is required' }),
  amount_offered: z.string().min(1, { message: 'Amount offered is required' }),
  amount_consumed: z.string().optional(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
  refused: z.boolean().default(false),
  notes: z.string().optional(),
  timestamp: z.date({
    required_error: 'Please select a date and time',
  }),
  schedule_id: z.string().optional(),
});

type FeedingFormValues = z.infer<typeof feedingFormSchema>;

interface FeedingFormProps {
  dogId: string;
  onSuccess?: () => void;
  recordId?: string;
  initialValues?: Partial<FeedingFormValues>;
  schedules?: FeedingSchedule[];
}

const FeedingForm: React.FC<FeedingFormProps> = ({ 
  dogId, 
  onSuccess,
  recordId,
  initialValues = {},
  schedules = []
}) => {
  const { logFeeding, updateFeedingLog, loading } = useFeeding();
  const { toast } = useToast();
  
  // Set up form with default values
  const form = useForm<FeedingFormValues>({
    resolver: zodResolver(feedingFormSchema),
    defaultValues: {
      food_type: '',
      amount_offered: '',
      amount_consumed: '',
      meal_type: 'breakfast',
      refused: false,
      notes: '',
      timestamp: new Date(),
      schedule_id: '',
      ...initialValues
    }
  });
  
  // Watch refused to control amount consumed
  const refused = form.watch('refused');
  
  // Handle form submission
  const onSubmit = async (values: FeedingFormValues) => {
    try {
      // If refused, set amount consumed to 0
      if (values.refused) {
        values.amount_consumed = '0';
      }
      
      const formData: FeedingFormData = {
        dog_id: dogId,
        ...values,
        // Only include schedule_id if one is selected
        schedule_id: values.schedule_id || undefined
      };
      
      let result;
      
      if (recordId) {
        // Update existing record
        result = await updateFeedingLog(recordId, formData);
      } else {
        // Create new record
        result = await logFeeding(formData);
      }
      
      if (result && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting feeding record:', error);
      toast({
        title: 'Error',
        description: 'Failed to save feeding record',
        variant: 'destructive',
      });
    }
  };

  // Handle selecting a schedule
  const handleScheduleSelect = (scheduleId: string) => {
    // Find the selected schedule
    const selectedSchedule = schedules.find(s => s.id === scheduleId);
    
    if (selectedSchedule) {
      // Update food type and amount fields with schedule values
      form.setValue('food_type', selectedSchedule.food_type);
      form.setValue('amount_offered', selectedSchedule.amount);
      form.setValue('schedule_id', scheduleId);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {recordId ? 'Edit Feeding Record' : 'Log Feeding'}
        </DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Schedule Selection (if schedules are available) */}
          {schedules.length > 0 && (
            <FormField
              control={form.control}
              name="schedule_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feeding Schedule</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleScheduleSelect(value);
                    }}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a feeding schedule (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No schedule (manual entry)</SelectItem>
                      {schedules.map(schedule => (
                        <SelectItem key={schedule.id} value={schedule.id}>
                          {schedule.food_type} - {schedule.amount}{schedule.unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Meal Type */}
          <FormField
            control={form.control}
            name="meal_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meal Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Food Type */}
          <FormField
            control={form.control}
            name="food_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Food Type</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter food type (e.g., Dry Kibble, Wet Food)" 
                    {...field} 
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Amount Offered and Consumed */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount_offered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Offered</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter amount" 
                      {...field} 
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount_consumed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Consumed</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={refused ? "0" : "Enter amount consumed"} 
                      {...field}
                      value={refused ? "0" : field.value || ''}
                      disabled={refused || loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Refused Toggle */}
          <FormField
            control={form.control}
            name="refused"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Food Refused</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Check if the dog refused to eat
                  </p>
                </div>
              </FormItem>
            )}
          />
          
          {/* Date and Time */}
          <FormField
            control={form.control}
            name="timestamp"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date and Time</FormLabel>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[200px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={loading}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            const newDate = new Date(field.value);
                            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                            field.onChange(newDate);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <FormControl>
                    <Input
                      type="time"
                      className="w-[150px]"
                      value={field.value ? format(field.value, "HH:mm") : ""}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':').map(Number);
                        const newDate = new Date(field.value);
                        newDate.setHours(hours, minutes);
                        field.onChange(newDate);
                      }}
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter any notes about this feeding" 
                    className="min-h-[80px]" 
                    {...field} 
                    value={field.value || ''}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : recordId ? 'Update Feeding' : 'Log Feeding'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default FeedingForm;
