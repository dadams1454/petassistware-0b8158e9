
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
  FormDescription,
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDailyCare } from '@/contexts/dailyCare';
import { 
  MedicationFrequency, 
  getTimeSlotsForFrequency, 
  calculateNextDueDate 
} from '@/utils/medicationUtils';
import { MedicationLogFormData } from '@/types/dailyCare';

const formSchema = z.object({
  dog_id: z.string(),
  category: z.string().default('medications'),
  task_name: z.string().min(1, { message: 'Medication name is required'}),
  timestamp: z.date(),
  notes: z.string().optional(),
  frequency: z.string().default(MedicationFrequency.MONTHLY),
  nextDueDate: z.date().optional(),
  medicationType: z.enum(['preventative', 'treatment'])
});

interface MedicationFormProps {
  dogId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ 
  dogId, 
  onSuccess, 
  onCancel 
}) => {
  const { addCareLog } = useDailyCare();
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dog_id: dogId,
      category: 'medications',
      task_name: '',
      timestamp: new Date(),
      notes: '',
      frequency: MedicationFrequency.MONTHLY,
      medicationType: 'preventative'
    }
  });
  
  // Watch frequency to update time slots and next due date
  const frequency = form.watch('frequency') as MedicationFrequency;
  const timestamp = form.watch('timestamp');
  
  // Update time slots when frequency changes
  useEffect(() => {
    const slots = getTimeSlotsForFrequency(frequency as MedicationFrequency);
    setTimeSlots(slots);
    
    // Update next due date when frequency or timestamp changes
    if (timestamp) {
      const nextDueDate = calculateNextDueDate(
        new Date(timestamp), 
        frequency as MedicationFrequency
      );
      form.setValue('nextDueDate', nextDueDate);
    }
  }, [frequency, timestamp, form]);
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Add frequency-specific information to the task name
      const medicationFrequency = data.frequency as MedicationFrequency;
      const frequencyLabel = medicationFrequency.charAt(0).toUpperCase() + medicationFrequency.slice(1);
      const medicationWithFrequency = `${data.task_name} (${frequencyLabel})`;
      
      // Prepare data for submission
      const medicationData: MedicationLogFormData = {
        dog_id: data.dog_id,
        category: data.category,
        task_name: medicationWithFrequency,
        timestamp: data.timestamp,
        notes: data.notes,
        frequency: data.frequency,
        nextDueDate: data.nextDueDate,
        medicationType: data.medicationType
      };
      
      // Save the medication log
      await addCareLog(medicationData);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving medication:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="task_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medication Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter medication name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="medicationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medication Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="preventative">Preventative</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Preventative medications are routine (e.g., heartworm). Treatment medications are for specific conditions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={MedicationFrequency.DAILY}>Daily</SelectItem>
                    <SelectItem value={MedicationFrequency.WEEKLY}>Weekly</SelectItem>
                    <SelectItem value={MedicationFrequency.MONTHLY}>Monthly</SelectItem>
                    <SelectItem value={MedicationFrequency.QUARTERLY}>Quarterly</SelectItem>
                    <SelectItem value={MedicationFrequency.ANNUAL}>Annual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="timestamp"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Administration Date</FormLabel>
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
            name="nextDueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Next Due Date (Calculated)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal opacity-70",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={true}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Calculated date will appear here</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <p className="text-sm">
                        This date is calculated automatically based on the frequency and administration date.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Next due date is calculated automatically based on frequency
                </FormDescription>
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
                  placeholder="Enter any notes about this medication"
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
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
            Save Medication
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MedicationForm;
