
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { MedicationRecord, MedicationFormData, MedicationFrequency, MedicationType, MedicationRoute } from '@/types/medication';
import { createMedicationRecord, updateMedicationRecord } from '@/services/medicationService';
import { useUser } from '@/contexts/UserContext';

// Form validation schema
const medicationFormSchema = z.object({
  medication_name: z.string().min(2, { message: "Medication name is required" }),
  dosage: z.string().optional(),
  dosage_unit: z.string().optional(),
  frequency: z.nativeEnum(MedicationFrequency),
  route: z.nativeEnum(MedicationRoute).optional(),
  start_date: z.date(),
  end_date: z.date().optional().nullable(),
  medication_type: z.nativeEnum(MedicationType),
  prescription_id: z.string().optional(),
  refills_remaining: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

type MedicationFormValues = z.infer<typeof medicationFormSchema>;

interface MedicationFormProps {
  dogId: string;
  existingMedication?: MedicationRecord;
  onSuccess: () => void;
  onCancel: () => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({
  dogId,
  existingMedication,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  // Initialize form with default values or existing medication data
  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      medication_name: existingMedication?.medication_name || '',
      dosage: existingMedication?.dosage || '',
      dosage_unit: existingMedication?.dosage_unit || '',
      frequency: existingMedication?.frequency || MedicationFrequency.DAILY,
      route: existingMedication?.route || undefined,
      start_date: existingMedication?.start_date ? new Date(existingMedication.start_date) : new Date(),
      end_date: existingMedication?.end_date ? new Date(existingMedication.end_date) : null,
      medication_type: existingMedication?.medication_type || MedicationType.TREATMENT,
      prescription_id: existingMedication?.prescription_id || '',
      refills_remaining: existingMedication?.refills_remaining || 0,
      notes: existingMedication?.notes || '',
    },
  });

  const handleSubmit = async (data: MedicationFormValues) => {
    setIsSubmitting(true);
    try {
      const medicationData: MedicationFormData = {
        ...data,
        dog_id: dogId,
        created_by: user?.id,
      };

      // Update or create medication record
      if (existingMedication) {
        await updateMedicationRecord(existingMedication.id, medicationData);
        toast({ title: "Medication updated", description: "The medication has been updated successfully." });
      } else {
        await createMedicationRecord(medicationData);
        toast({ title: "Medication added", description: "The medication has been added successfully." });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving medication:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "An error occurred while saving the medication", 
        variant: "destructive" 
      });
    } finally {
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
                <Input {...field} placeholder="Enter medication name" />
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
                <FormLabel>Dosage Amount</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 10" />
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
                <FormLabel>Dosage Unit</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., mg, ml" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                    {Object.values(MedicationFrequency).map(freq => (
                      <SelectItem key={freq} value={freq}>
                        {freq.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}
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
            name="route"
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
                    {Object.values(MedicationRoute).map(route => (
                      <SelectItem key={route} value={route}>
                        {route.charAt(0).toUpperCase() + route.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                          "text-left font-normal",
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
                          "text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="medication_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medication Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(MedicationType).map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="prescription_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prescription ID (if applicable)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter prescription ID" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="refills_remaining"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Refills Remaining</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </FormControl>
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
                <Textarea {...field} placeholder="Additional information about this medication" />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : existingMedication ? 'Update Medication' : 'Add Medication'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MedicationForm;
