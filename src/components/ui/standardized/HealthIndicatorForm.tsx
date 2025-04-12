
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { AppetiteEnum, EnergyEnum, StoolConsistencyEnum } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';

// Define the form schema
const healthIndicatorSchema = z.object({
  appetite: z.string().min(1, "Please select an appetite level"),
  energy: z.string().min(1, "Please select an energy level"),
  stool_consistency: z.string().min(1, "Please select stool consistency"),
  date: z.date({
    required_error: "Please select a date"
  }),
  notes: z.string().optional()
});

type HealthIndicatorFormValues = z.infer<typeof healthIndicatorSchema>;

interface HealthIndicatorFormProps {
  dogId: string;
  isSubmitting?: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const HealthIndicatorForm: React.FC<HealthIndicatorFormProps> = ({
  dogId,
  isSubmitting = false,
  onSubmit,
  onCancel
}) => {
  const form = useForm<HealthIndicatorFormValues>({
    resolver: zodResolver(healthIndicatorSchema),
    defaultValues: {
      appetite: '',
      energy: '',
      stool_consistency: '',
      date: new Date(),
      notes: ''
    }
  });
  
  const handleSubmit = (values: HealthIndicatorFormValues) => {
    onSubmit({
      ...values,
      dog_id: dogId
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="appetite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appetite</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appetite level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={AppetiteEnum.EXCELLENT}>Excellent</SelectItem>
                    <SelectItem value={AppetiteEnum.GOOD}>Good</SelectItem>
                    <SelectItem value={AppetiteEnum.FAIR}>Fair</SelectItem>
                    <SelectItem value={AppetiteEnum.POOR}>Poor</SelectItem>
                    <SelectItem value={AppetiteEnum.NONE}>None</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="energy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Energy Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select energy level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EnergyEnum.HYPERACTIVE}>Hyperactive</SelectItem>
                    <SelectItem value={EnergyEnum.HIGH}>High</SelectItem>
                    <SelectItem value={EnergyEnum.NORMAL}>Normal</SelectItem>
                    <SelectItem value={EnergyEnum.LOW}>Low</SelectItem>
                    <SelectItem value={EnergyEnum.LETHARGIC}>Lethargic</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stool_consistency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stool Consistency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stool consistency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={StoolConsistencyEnum.NORMAL}>Normal</SelectItem>
                    <SelectItem value={StoolConsistencyEnum.SOFT}>Soft</SelectItem>
                    <SelectItem value={StoolConsistencyEnum.LOOSE}>Loose</SelectItem>
                    <SelectItem value={StoolConsistencyEnum.WATERY}>Watery</SelectItem>
                    <SelectItem value={StoolConsistencyEnum.HARD}>Hard</SelectItem>
                    <SelectItem value={StoolConsistencyEnum.BLOODY}>Bloody</SelectItem>
                    <SelectItem value={StoolConsistencyEnum.MUCUS}>Mucus</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter any additional observations..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Indicators'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HealthIndicatorForm;
