
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface MedicationFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  puppyWeight?: number;
  puppyWeightUnit?: string;
}

const formSchema = z.object({
  medicationName: z.string().min(1, {
    message: "Medication name is required",
  }),
  dosage: z.string().min(1, {
    message: "Dosage is required",
  }),
  dosageUnit: z.string().min(1, {
    message: "Dosage unit is required",
  }),
  frequency: z.string().min(1, {
    message: "Frequency is required",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  administrationRoute: z.string().min(1, {
    message: "Administration route is required",
  }),
  notes: z.string().optional(),
});

const MedicationForm: React.FC<MedicationFormProps> = ({ 
  onSubmit, 
  initialData,
  puppyWeight,
  puppyWeightUnit = 'lb'
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      medicationName: initialData.medication_name,
      dosage: initialData.dosage?.toString(),
      dosageUnit: initialData.dosage_unit,
      frequency: initialData.frequency,
      startDate: initialData.start_date ? new Date(initialData.start_date) : undefined,
      endDate: initialData.end_date ? new Date(initialData.end_date) : undefined,
      administrationRoute: initialData.administration_route,
      notes: initialData.notes || ''
    } : {
      medicationName: '',
      dosage: '',
      dosageUnit: 'mg',
      frequency: 'daily',
      administrationRoute: 'oral',
      notes: ''
    }
  });
  
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  const frequencyOptions = [
    { value: 'daily', label: 'Once Daily' },
    { value: 'twice-daily', label: 'Twice Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Every 2 Weeks' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'as-needed', label: 'As Needed (PRN)' }
  ];

  const routeOptions = [
    { value: 'oral', label: 'Oral' },
    { value: 'topical', label: 'Topical' },
    { value: 'injection', label: 'Injection' },
    { value: 'subcutaneous', label: 'Subcutaneous' },
    { value: 'intramuscular', label: 'Intramuscular' },
    { value: 'intravenous', label: 'Intravenous' },
    { value: 'inhalation', label: 'Inhalation' },
    { value: 'otic', label: 'Otic (Ear)' },
    { value: 'ophthalmic', label: 'Ophthalmic (Eye)' }
  ];

  const dosageUnitOptions = [
    { value: 'mg', label: 'mg' },
    { value: 'mL', label: 'mL' },
    { value: 'tablet', label: 'tablet' },
    { value: 'capsule', label: 'capsule' },
    { value: 'drop', label: 'drop' },
    { value: 'µg', label: 'µg (mcg)' },
    { value: 'IU', label: 'IU' },
    { value: 'mg/kg', label: 'mg/kg' }
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="medicationName"
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter dosage amount" 
                    {...field} 
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dosageUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage Unit</FormLabel>
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
                    {dosageUnitOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {puppyWeight && (
          <div className="bg-muted p-2 rounded-md text-sm">
            <p className="font-medium">Weight-Based Dosing Guide</p>
            <p>Current weight: {puppyWeight} {puppyWeightUnit}</p>
            <p className="text-xs text-muted-foreground mt-1">
              For weight-based medications, adjust the dosage according to the puppy's current weight.
            </p>
          </div>
        )}
        
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
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="administrationRoute"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administration Route</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {routeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value ? "text-muted-foreground" : ""
                        }`}
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
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value ? "text-muted-foreground" : ""
                        }`}
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
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Leave blank for ongoing medications
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
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Special instructions or additional details"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">Save Medication</Button>
        </div>
      </form>
    </Form>
  );
};

export default MedicationForm;
