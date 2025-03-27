
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Plus, Minus, CalendarClock } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useFeeding } from '@/contexts/feeding';
import { FeedingScheduleFormData, FeedingSchedule } from '@/types/feeding';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

// Form validation schema
const feedingScheduleSchema = z.object({
  food_type: z.string().min(1, { message: 'Food type is required' }),
  amount: z.string().min(1, { message: 'Amount is required' }),
  unit: z.enum(['cups', 'grams', 'ounces', 'tablespoons', 'teaspoons']),
  schedule_time: z.array(z.string()).min(1, { message: 'At least one feeding time is required' }),
  special_instructions: z.string().optional(),
  active: z.boolean().default(true),
});

type FeedingScheduleValues = z.infer<typeof feedingScheduleSchema>;

interface FeedingScheduleFormProps {
  dogId: string;
  onSuccess?: () => void;
  scheduleId?: string;
  initialValues?: Partial<FeedingScheduleValues>;
}

const FeedingScheduleForm: React.FC<FeedingScheduleFormProps> = ({ 
  dogId, 
  onSuccess,
  scheduleId,
  initialValues = {}
}) => {
  const { createSchedule, updateSchedule, loading } = useFeeding();
  const { toast } = useToast();
  
  // Set up form with default values
  const form = useForm<FeedingScheduleValues>({
    resolver: zodResolver(feedingScheduleSchema),
    defaultValues: {
      food_type: '',
      amount: '',
      unit: 'cups',
      schedule_time: ['08:00', '18:00'],
      special_instructions: '',
      active: true,
      ...initialValues
    }
  });
  
  // Watch schedule times for dynamic fields
  const scheduleTimes = form.watch('schedule_time');
  
  // Add a new time slot
  const addTimeSlot = () => {
    const currentTimes = form.getValues('schedule_time');
    form.setValue('schedule_time', [...currentTimes, '']);
  };
  
  // Remove a time slot
  const removeTimeSlot = (index: number) => {
    const currentTimes = form.getValues('schedule_time');
    if (currentTimes.length > 1) { // Ensure at least one time slot remains
      const updatedTimes = [...currentTimes];
      updatedTimes.splice(index, 1);
      form.setValue('schedule_time', updatedTimes);
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: FeedingScheduleValues) => {
    try {
      const formData: FeedingScheduleFormData = {
        dog_id: dogId,
        ...values
      };
      
      let result;
      
      if (scheduleId) {
        // Update existing schedule
        result = await updateSchedule(scheduleId, formData);
      } else {
        // Create new schedule
        result = await createSchedule(formData);
      }
      
      if (result && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting feeding schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to save feeding schedule',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {scheduleId ? 'Edit Feeding Schedule' : 'Create Feeding Schedule'}
        </DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
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
          
          {/* Amount and Unit */}
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Amount</FormLabel>
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
              name="unit"
              render={({ field }) => (
                <FormItem className="w-[150px]">
                  <FormLabel>Unit</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={loading}
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
          
          {/* Feeding Times */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel>Feeding Times</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTimeSlot}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Time
              </Button>
            </div>
            
            {scheduleTimes.map((time, index) => (
              <div key={index} className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <FormField
                  control={form.control}
                  name={`schedule_time.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimeSlot(index)}
                  disabled={scheduleTimes.length <= 1 || loading}
                >
                  <Minus className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Special Instructions */}
          <FormField
            control={form.control}
            name="special_instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Instructions</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter any special feeding instructions" 
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
          
          {/* Active Status */}
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Active Schedule
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Toggle to activate or deactivate this feeding schedule
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : scheduleId ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default FeedingScheduleForm;
