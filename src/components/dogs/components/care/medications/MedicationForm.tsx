
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MedicationFormProps } from './types/medicationTypes';
import { MedicationFrequency } from '@/utils/medicationUtils';

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

const formSchema = z.object({
  medicationName: z.string().min(1, { message: "Medication name is required" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  dosageUnit: z.string().min(1, { message: "Dosage unit is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional().nullable(),
  administrationRoute: z.string().min(1, { message: "Administration route is required" }),
  preventative: z.boolean().default(false),
  notes: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

const MedicationForm: React.FC<MedicationFormProps> = ({ 
  dogId, 
  onSuccess, 
  onCancel,
  initialData 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      medicationName: initialData.medication_name,
      dosage: initialData.dosage?.toString() || '',
      dosageUnit: initialData.dosage_unit || 'mg',
      frequency: initialData.frequency || 'daily',
      startDate: initialData.start_date ? new Date(initialData.start_date) : new Date(),
      endDate: initialData.end_date ? new Date(initialData.end_date) : null,
      administrationRoute: initialData.administration_route || 'oral',
      preventative: initialData.preventative || false,
      notes: initialData.notes || ''
    } : {
      medicationName: '',
      dosage: '',
      dosageUnit: 'mg',
      frequency: 'daily',
      startDate: new Date(),
      endDate: null,
      administrationRoute: 'oral',
      preventative: false,
      notes: ''
    }
  });
  
  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Prepare metadata for the medication
      const medicationMetadata = {
        preventative: data.preventative,
        frequency: data.frequency,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate ? data.endDate.toISOString() : null,
        dosage: parseFloat(data.dosage),
        dosage_unit: data.dosageUnit
      };
      
      // Log the medication in the daily care logs
      const { error } = await supabase
        .from('daily_care_logs')
        .insert({
          dog_id: dogId,
          category: 'medications',
          task_name: data.medicationName,
          notes: data.notes,
          timestamp: new Date().toISOString(),
          medication_metadata: medicationMetadata
        });
      
      if (error) throw error;
      
      toast({
        title: "Medication Logged",
        description: `${data.medicationName} has been logged successfully.`
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error logging medication:', error);
      toast({
        title: "Error",
        description: "Failed to log medication. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const frequencyOptions = [
    { value: MedicationFrequency.Daily, label: 'Once Daily' },
    { value: MedicationFrequency.TwiceDaily, label: 'Twice Daily' },
    { value: MedicationFrequency.Weekly, label: 'Weekly' },
    { value: MedicationFrequency.Biweekly, label: 'Every 2 Weeks' },
    { value: MedicationFrequency.Monthly, label: 'Monthly' },
    { value: MedicationFrequency.AsNeeded, label: 'As Needed (PRN)' }
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
    { value: 'IU', label: 'IU' }
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage</FormLabel>
                <FormControl>
                  <Input placeholder="Enter dosage amount" {...field} />
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
                          <span>No end date</span>
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
          name="preventative"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Preventative Medication</FormLabel>
                <FormDescription>
                  Mark if this is a preventative medication (e.g., heartworm, flea treatment)
                </FormDescription>
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
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Medication'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MedicationForm;
