
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { useFeeding } from '@/contexts/FeedingContext';
import { FeedingSchedule } from '@/types/feeding';
import { FeedingFormData } from '@/types/feeding';

interface FeedingFormProps {
  dogId: string;
  recordId?: string;
  schedules?: FeedingSchedule[];
  initialValues?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const formSchema = z.object({
  food_type: z.string().min(1, {
    message: "Please enter the type of food.",
  }),
  amount_offered: z.string().min(1, {
    message: "Please enter the amount offered.",
  }),
  amount_consumed: z.string().optional(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
  refused: z.boolean().optional(),
  notes: z.string().optional(),
  timestamp: z.date().optional(),
  schedule_id: z.string().optional()
});

const FeedingForm: React.FC<FeedingFormProps> = ({ 
  dogId, 
  recordId, 
  schedules, 
  initialValues, 
  onSuccess, 
  onCancel 
}) => {
  const { createRecord } = useFeeding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      food_type: '',
      amount_offered: '',
      amount_consumed: '',
      meal_type: 'breakfast',
      refused: false,
      notes: '',
      timestamp: new Date(),
    },
  });

  // Submit form data
  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const feedingData: FeedingFormData = {
        dog_id: dogId,
        food_type: formData.food_type,
        amount_offered: formData.amount_offered,
        amount_consumed: formData.amount_consumed,
        meal_type: formData.meal_type,
        refused: formData.refused,
        notes: formData.notes,
        timestamp: formData.timestamp || new Date(),
        schedule_id: formData.schedule_id
      };

      await createRecord(feedingData);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating feeding record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="food_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter food type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount_offered"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount Offered</FormLabel>
              <FormControl>
                <Input placeholder="Enter amount offered" {...field} />
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
              <FormLabel>Amount Consumed (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter amount consumed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meal_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a meal type" />
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

        <FormField
          control={form.control}
          name="refused"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Refused to Eat?</FormLabel>
                {/* <FormDescription>
                  Did the dog refuse to eat the meal?
                </FormDescription> */}
              </div>
              <FormControl>
                <Input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timestamp"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Timestamp</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schedule_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a schedule" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schedules?.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.food_type} - {schedule.amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes about the feeding"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log Feeding
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedingForm;
