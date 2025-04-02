
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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Define the form schema
const vaccinationSchema = z.object({
  vaccine_name: z.string().min(1, { message: 'Vaccine name is required' }),
  due_date: z.date({ required_error: 'Due date is required' }),
  administered: z.boolean().default(false),
  administered_date: z.date().optional(),
  notes: z.string().optional(),
});

export interface VaccinationFormProps {
  puppyId?: string;
  initialData?: any;
  onSave: () => void;
  onCancel: () => void;
  onSubmit: (data: any) => Promise<boolean>;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({
  puppyId,
  initialData,
  onSave,
  onCancel,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [administered, setAdministered] = useState(initialData?.administered || false);

  const form = useForm<z.infer<typeof vaccinationSchema>>({
    resolver: zodResolver(vaccinationSchema),
    defaultValues: {
      vaccine_name: initialData?.vaccine_name || '',
      due_date: initialData?.due_date ? new Date(initialData.due_date) : new Date(),
      administered: initialData?.administered || false,
      administered_date: initialData?.administered_date ? new Date(initialData.administered_date) : undefined,
      notes: initialData?.notes || '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof vaccinationSchema>) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        puppy_id: puppyId,
        due_date: data.due_date.toISOString(),
        administered_date: data.administered_date ? data.administered_date.toISOString() : null,
      };

      const success = await onSubmit(formattedData);
      if (success) {
        onSave();
      }
    } catch (error) {
      console.error('Error submitting vaccination form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="vaccine_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vaccine Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter vaccine name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
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
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
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
            name="administered"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      setAdministered(checked === true);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Administered</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {administered && (
            <FormField
              control={form.control}
              name="administered_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Administered Date</FormLabel>
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
                        selected={field.value || undefined}
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
          )}

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input placeholder="Enter any additional notes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VaccinationForm;
