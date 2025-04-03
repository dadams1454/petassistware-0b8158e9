
import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AppetiteLevelEnum, EnergyLevelEnum, StoolConsistencyEnum } from '@/types/health';

// Validation schema for health indicators form
const healthIndicatorFormSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  appetite: z.string({
    required_error: "Appetite level is required",
  }),
  energy: z.string({
    required_error: "Energy level is required",
  }),
  stool_consistency: z.string({
    required_error: "Stool consistency is required",
  }),
  abnormal: z.boolean().default(false),
  notes: z.string().optional(),
});

type HealthIndicatorFormValues = z.infer<typeof healthIndicatorFormSchema>;

interface HealthIndicatorFormProps {
  dogId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  isSubmitting?: boolean;
}

const HealthIndicatorForm: React.FC<HealthIndicatorFormProps> = ({
  dogId,
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
}) => {
  const form = useForm<HealthIndicatorFormValues>({
    resolver: zodResolver(healthIndicatorFormSchema),
    defaultValues: {
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      appetite: initialData?.appetite || AppetiteLevelEnum.Good,
      energy: initialData?.energy || EnergyLevelEnum.Normal,
      stool_consistency: initialData?.stool_consistency || StoolConsistencyEnum.Normal,
      abnormal: initialData?.abnormal || false,
      notes: initialData?.notes || '',
    },
  });

  const handleSubmit = (values: HealthIndicatorFormValues) => {
    // Format the data and call onSubmit
    const formattedData = {
      dog_id: dogId,
      date: format(values.date, 'yyyy-MM-dd'),
      appetite: values.appetite,
      energy: values.energy,
      stool_consistency: values.stool_consistency,
      abnormal: values.abnormal,
      notes: values.notes,
    };

    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Appetite Field */}
        <FormField
          control={form.control}
          name="appetite"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Appetite</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={AppetiteLevelEnum.Excellent} />
                    </FormControl>
                    <FormLabel className="font-normal">Excellent</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={AppetiteLevelEnum.Good} />
                    </FormControl>
                    <FormLabel className="font-normal">Good</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={AppetiteLevelEnum.Fair} />
                    </FormControl>
                    <FormLabel className="font-normal">Fair</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={AppetiteLevelEnum.Poor} />
                    </FormControl>
                    <FormLabel className="font-normal">Poor</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={AppetiteLevelEnum.None} />
                    </FormControl>
                    <FormLabel className="font-normal">None</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Energy Field */}
        <FormField
          control={form.control}
          name="energy"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Energy Level</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={EnergyLevelEnum.Hyperactive} />
                    </FormControl>
                    <FormLabel className="font-normal">Hyperactive</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={EnergyLevelEnum.High} />
                    </FormControl>
                    <FormLabel className="font-normal">High</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={EnergyLevelEnum.Normal} />
                    </FormControl>
                    <FormLabel className="font-normal">Normal</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={EnergyLevelEnum.Low} />
                    </FormControl>
                    <FormLabel className="font-normal">Low</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={EnergyLevelEnum.Lethargic} />
                    </FormControl>
                    <FormLabel className="font-normal">Lethargic</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stool Consistency Field */}
        <FormField
          control={form.control}
          name="stool_consistency"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Stool Consistency</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={StoolConsistencyEnum.Normal} />
                    </FormControl>
                    <FormLabel className="font-normal">Normal</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={StoolConsistencyEnum.Soft} />
                    </FormControl>
                    <FormLabel className="font-normal">Soft</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={StoolConsistencyEnum.Loose} />
                    </FormControl>
                    <FormLabel className="font-normal">Loose</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={StoolConsistencyEnum.Watery} />
                    </FormControl>
                    <FormLabel className="font-normal">Watery</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={StoolConsistencyEnum.Hard} />
                    </FormControl>
                    <FormLabel className="font-normal">Hard</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={StoolConsistencyEnum.Mucousy} />
                    </FormControl>
                    <FormLabel className="font-normal">Mucousy</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={StoolConsistencyEnum.Bloody} />
                    </FormControl>
                    <FormLabel className="font-normal">Bloody</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Abnormal Field */}
        <FormField
          control={form.control}
          name="abnormal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Flag as abnormal
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  This will mark the health indicator as requiring attention
                </p>
              </div>
            </FormItem>
          )}
        />

        {/* Notes Field */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional observations or concerns"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Health Indicator"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HealthIndicatorForm;
