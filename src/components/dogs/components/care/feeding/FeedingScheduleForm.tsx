
import React, { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFeeding } from '@/contexts/FeedingContext';
import { FeedingScheduleFormData, FeedingSchedule } from '@/types/feeding';

interface FeedingScheduleFormProps {
  dogId: string;
  schedule?: FeedingSchedule;
  scheduleId?: string;
  initialValues?: Partial<FeedingScheduleFormData>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const formSchema = z.object({
  food_type: z.string().min(1, { message: 'Food type is required' }),
  amount: z.string().min(1, { message: 'Amount is required' }),
  unit: z.enum(['cups', 'grams', 'ounces', 'tablespoons', 'teaspoons']),
  schedule_time: z.string().array().min(1, { message: 'At least one time is required' }),
  special_instructions: z.string().optional(),
  active: z.boolean().default(true)
});

const FeedingScheduleForm: React.FC<FeedingScheduleFormProps> = ({ 
  dogId,
  schedule,
  scheduleId,
  initialValues,
  onSuccess, 
  onCancel 
}) => {
  const [loading, setLoading] = useState(false);
  const { createSchedule, updateSchedule } = useFeeding();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || schedule ? {
      food_type: schedule?.food_type || '',
      amount: schedule?.amount || '',
      unit: schedule?.unit || 'cups',
      schedule_time: schedule?.schedule_time || [],
      special_instructions: schedule?.special_instructions || '',
      active: schedule?.active !== undefined ? schedule.active : true
    } : {
      food_type: '',
      amount: '',
      unit: 'cups',
      schedule_time: [],
      special_instructions: '',
      active: true
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      const formData: FeedingScheduleFormData = {
        dog_id: dogId,
        food_type: data.food_type,
        amount: data.amount,
        unit: data.unit,
        schedule_time: data.schedule_time,
        special_instructions: data.special_instructions,
        active: data.active || true
      };

      if (scheduleId) {
        await updateSchedule(scheduleId, formData);
      } else {
        await createSchedule(formData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error managing feeding schedule:', error);
    } finally {
      setLoading(false);
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cups">Cups</SelectItem>
                    <SelectItem value="grams">Grams</SelectItem>
                    <SelectItem value="ounces">Ounces</SelectItem>
                    <SelectItem value="tablespoons">Tablespoons</SelectItem>
                    <SelectItem value="teaspoons">Teaspoons</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="schedule_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule Time</FormLabel>
              <FormControl>
                <Input placeholder="Enter time (HH:MM)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="special_instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Instructions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter any special instructions"
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Schedule
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedingScheduleForm;
