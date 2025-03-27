
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TimeInput from '@/components/common/TimeInput';
import { useFeeding } from '@/contexts/feeding/FeedingContext';
import { FeedingScheduleFormData } from '@/types/feeding';

// Form schema
const feedingScheduleSchema = z.object({
  food_type: z.string().min(1, 'Food type is required'),
  amount: z.string().min(1, 'Amount is required'),
  unit: z.enum(['cups', 'grams', 'ounces', 'tablespoons', 'teaspoons']),
  schedule_time: z.array(z.string()).min(1, 'At least one feeding time is required'),
  special_instructions: z.string().optional(),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof feedingScheduleSchema>;

interface FeedingScheduleFormProps {
  dogId: string;
  scheduleId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultValues?: Partial<FeedingScheduleFormData>;
}

const FeedingScheduleForm: React.FC<FeedingScheduleFormProps> = ({ 
  dogId, 
  scheduleId, 
  onSuccess, 
  onCancel,
  defaultValues 
}) => {
  const { createSchedule, updateSchedule, loading } = useFeeding();
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(feedingScheduleSchema),
    defaultValues: {
      food_type: defaultValues?.food_type || '',
      amount: defaultValues?.amount || '',
      unit: (defaultValues?.unit as 'cups' | 'grams' | 'ounces' | 'tablespoons' | 'teaspoons') || 'cups',
      schedule_time: Array.isArray(defaultValues?.schedule_time) 
        ? defaultValues.schedule_time 
        : defaultValues?.schedule_time 
          ? [defaultValues.schedule_time] 
          : ['08:00'],
      special_instructions: defaultValues?.special_instructions || '',
      active: defaultValues?.active !== undefined ? defaultValues.active : true,
    }
  });
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      const scheduleData: FeedingScheduleFormData = {
        dog_id: dogId,
        ...values
      };
      
      if (scheduleId) {
        // Update existing schedule
        await updateSchedule(scheduleId, scheduleData);
      } else {
        // Create new schedule
        await createSchedule(scheduleData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving feeding schedule:', error);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-lg font-medium leading-none">
          {scheduleId ? 'Edit Feeding Schedule' : 'New Feeding Schedule'}
        </h2>
        
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
        
        <div className="grid grid-cols-2 gap-4">
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
                      <SelectValue placeholder="Select unit" />
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
              <FormLabel>Feeding Times</FormLabel>
              <FormControl>
                <TimeInput 
                  values={field.value}
                  onChange={field.onChange}
                  addButtonLabel="Add Feeding Time"
                />
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
                  placeholder="Enter any special feeding instructions" 
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Active Schedule</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Toggle to enable or disable this feeding schedule
                </div>
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
        
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (scheduleId ? 'Update Schedule' : 'Create Schedule')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedingScheduleForm;
