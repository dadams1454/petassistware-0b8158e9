
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { 
  AppetiteLevelEnum, 
  EnergyLevelEnum, 
  StoolConsistencyEnum 
} from '@/types/health';

// Define form validation schema
const healthIndicatorSchema = z.object({
  date: z.date({
    required_error: 'Date is required',
  }),
  appetite: z.nativeEnum(AppetiteLevelEnum, {
    required_error: 'Appetite level is required',
  }),
  energy: z.nativeEnum(EnergyLevelEnum, {
    required_error: 'Energy level is required',
  }),
  stool_consistency: z.nativeEnum(StoolConsistencyEnum, {
    required_error: 'Stool consistency is required',
  }),
  notes: z.string().optional(),
});

type HealthIndicatorFormValues = z.infer<typeof healthIndicatorSchema>;

interface HealthIndicatorFormProps {
  dogId: string;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const HealthIndicatorForm: React.FC<HealthIndicatorFormProps> = ({
  dogId,
  onSave,
  onCancel,
  isSubmitting
}) => {
  const form = useForm<HealthIndicatorFormValues>({
    resolver: zodResolver(healthIndicatorSchema),
    defaultValues: {
      date: new Date(),
    },
  });
  
  const handleSubmit = (values: HealthIndicatorFormValues) => {
    onSave({
      dog_id: dogId,
      date: values.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      appetite: values.appetite,
      energy: values.energy,
      stool_consistency: values.stool_consistency,
      notes: values.notes,
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date*</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
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
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="appetite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appetite*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appetite level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={AppetiteLevelEnum.EXCELLENT}>Excellent</SelectItem>
                    <SelectItem value={AppetiteLevelEnum.GOOD}>Good</SelectItem>
                    <SelectItem value={AppetiteLevelEnum.FAIR}>Fair</SelectItem>
                    <SelectItem value={AppetiteLevelEnum.POOR}>Poor</SelectItem>
                    <SelectItem value={AppetiteLevelEnum.NONE}>None</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="energy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Energy Level*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select energy level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EnergyLevelEnum.HYPERACTIVE}>Hyperactive</SelectItem>
                    <SelectItem value={EnergyLevelEnum.HIGH}>High</SelectItem>
                    <SelectItem value={EnergyLevelEnum.NORMAL}>Normal</SelectItem>
                    <SelectItem value={EnergyLevelEnum.LOW}>Low</SelectItem>
                    <SelectItem value={EnergyLevelEnum.LETHARGIC}>Lethargic</SelectItem>
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
                <FormLabel>Stool Consistency*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <SelectItem value={StoolConsistencyEnum.MUCOUSY}>Mucousy</SelectItem>
                    <SelectItem value={StoolConsistencyEnum.BLOODY}>Bloody</SelectItem>
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
                  placeholder="Add any additional observations or notes"
                  className="min-h-[100px]" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HealthIndicatorForm;
