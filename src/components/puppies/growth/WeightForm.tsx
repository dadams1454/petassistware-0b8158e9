
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { usePuppyWeightRecord } from '@/hooks/usePuppyWeightRecord';

const formSchema = z.object({
  weight: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Weight must be a positive number"
  }),
  weight_unit: z.string({
    required_error: "Please select a unit"
  }),
  date: z.date({
    required_error: "Please select a date"
  }),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface WeightFormProps {
  puppyId: string;
  birthDate?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const WeightForm: React.FC<WeightFormProps> = ({ 
  puppyId, 
  birthDate, 
  onSuccess, 
  onCancel 
}) => {
  const { addWeightRecord, isSubmitting } = usePuppyWeightRecord(puppyId);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: '',
      weight_unit: 'oz',
      date: new Date(),
      notes: ''
    }
  });
  
  const handleSubmit = async (values: FormValues) => {
    const success = await addWeightRecord({
      weight: parseFloat(values.weight),
      weight_unit: values.weight_unit,
      date: format(values.date, 'yyyy-MM-dd'),
      notes: values.notes || undefined
    });
    
    if (success && onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Weight*</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="Enter weight" 
                    {...field} 
                    min="0"
                    step="0.01"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="weight_unit"
            render={({ field }) => (
              <FormItem className="w-full sm:w-32">
                <FormLabel>Unit*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="oz">Ounces (oz)</SelectItem>
                    <SelectItem value="lb">Pounds (lb)</SelectItem>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
                    disabled={(date) => {
                      // Cannot be in the future
                      if (date > new Date()) return true;
                      // Cannot be before birth date
                      if (birthDate && date < new Date(birthDate)) return true;
                      return false;
                    }}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this weight record"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Weight Record"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WeightForm;
