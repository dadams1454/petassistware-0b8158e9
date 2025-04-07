import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AppetiteLevel, EnergyLevel, StoolConsistency } from '@/types';

// Form schema using zod
const healthIndicatorSchema = z.object({
  dog_id: z.string(),
  date: z.date().default(new Date()),
  appetite: z.string().optional(),
  energy: z.string().optional(),
  stool_consistency: z.string().optional(),
  abnormal: z.boolean().default(false),
  notes: z.string().optional(),
});

export type HealthIndicatorFormValues = z.infer<typeof healthIndicatorSchema>;

interface HealthIndicatorFormProps {
  dogId: string;
  isSubmitting?: boolean;
  onSubmit: (data: HealthIndicatorFormValues) => Promise<void>;
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
      dog_id: dogId,
      date: new Date(),
      appetite: undefined,
      energy: undefined,
      stool_consistency: undefined,
      abnormal: false,
      notes: '',
    },
  });

  const handleSubmit = async (values: HealthIndicatorFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="none">None</SelectItem>
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
                    <SelectItem value="hyperactive">Hyperactive</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="lethargic">Lethargic</SelectItem>
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
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="soft">Soft</SelectItem>
                    <SelectItem value="loose">Loose</SelectItem>
                    <SelectItem value="watery">Watery</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="bloody">Bloody</SelectItem>
                    <SelectItem value="mucus">Mucus</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="abnormal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Mark as abnormal/concerning</FormLabel>
                <p className="text-sm text-muted-foreground">This will flag the record for follow-up</p>
              </div>
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
                  placeholder="Add any additional observations or concerns"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
            {isSubmitting ? 'Saving...' : 'Save Indicators'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HealthIndicatorForm;
