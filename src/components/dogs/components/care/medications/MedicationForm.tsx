
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { MedicationFrequency } from '@/utils/medicationUtils';

// Define the form schema
const medicationFormSchema = z.object({
  medication_name: z.string().min(1, 'Medication name is required'),
  dosage: z.coerce.number().min(0.01, 'Dosage must be greater than 0'),
  dosage_unit: z.string().min(1, 'Dosage unit is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  administration_route: z.string().min(1, 'Administration route is required'),
  start_date: z.date(),
  end_date: z.date().optional().nullable(),
  last_administered: z.date().optional().nullable(),
  notes: z.string().optional(),
});

type MedicationFormValues = z.infer<typeof medicationFormSchema>;

interface MedicationFormProps {
  dogId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ dogId, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: MedicationFormValues = {
    medication_name: '',
    dosage: 0,
    dosage_unit: 'mg',
    frequency: MedicationFrequency.Monthly,
    administration_route: 'Oral',
    start_date: new Date(),
    end_date: null,
    last_administered: new Date(),
    notes: '',
  };
  
  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues,
  });
  
  const handleSubmit = async (values: MedicationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to save medication
      console.log('Medication form values:', { dog_id: dogId, ...values });
      
      // Mock success
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 500);
    } catch (error) {
      console.error('Error saving medication:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="medication_name"
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
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dosage_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="tablet">tablet</SelectItem>
                    <SelectItem value="capsule">capsule</SelectItem>
                    <SelectItem value="application">application</SelectItem>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={MedicationFrequency.Daily}>Daily</SelectItem>
                  <SelectItem value={MedicationFrequency.Weekly}>Weekly</SelectItem>
                  <SelectItem value={MedicationFrequency.Monthly}>Monthly</SelectItem>
                  <SelectItem value={MedicationFrequency.Quarterly}>Quarterly</SelectItem>
                  <SelectItem value={MedicationFrequency.Annual}>Annually</SelectItem>
                  <SelectItem value={MedicationFrequency.AsNeeded}>As Needed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="administration_route"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administration Route</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Oral">Oral</SelectItem>
                  <SelectItem value="Topical">Topical</SelectItem>
                  <SelectItem value="Injectable">Injectable</SelectItem>
                  <SelectItem value="Otic">Otic (Ear)</SelectItem>
                  <SelectItem value="Ophthalmic">Ophthalmic (Eye)</SelectItem>
                  <SelectItem value="Nasal">Nasal</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
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
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="last_administered"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Last Administered (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
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
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes about this medication..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Medication'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MedicationForm;
