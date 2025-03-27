
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
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { createMedicationRecord, updateMedicationRecord } from '@/services/medicationService';
import { MedicationRecord, MedicationFormData, MedicationFrequency, MedicationRoute, MedicationType } from '@/types/medication';
import { calculateNextDueDate } from '@/services/medicationService';

interface MedicationFormProps {
  dogId: string;
  existingMedication?: MedicationRecord;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Create form schema for validation
const formSchema = z.object({
  medication_name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().optional(),
  dosage_unit: z.string().optional(),
  frequency: z.nativeEnum(MedicationFrequency),
  route: z.nativeEnum(MedicationRoute).optional(),
  start_date: z.date(),
  end_date: z.date().optional(),
  notes: z.string().optional(),
  medication_type: z.nativeEnum(MedicationType),
  prescription_id: z.string().optional(),
  refills_remaining: z.number().int().nonnegative().optional(),
  next_due_date: z.date().optional()
});

const MedicationForm: React.FC<MedicationFormProps> = ({ 
  dogId, 
  existingMedication, 
  onSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  
  // Initialize form with default values or existing medication data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: existingMedication ? {
      medication_name: existingMedication.medication_name,
      dosage: existingMedication.dosage,
      dosage_unit: existingMedication.dosage_unit,
      frequency: existingMedication.frequency,
      route: existingMedication.route,
      start_date: existingMedication.start_date ? new Date(existingMedication.start_date) : new Date(),
      end_date: existingMedication.end_date ? new Date(existingMedication.end_date) : undefined,
      notes: existingMedication.notes,
      medication_type: existingMedication.medication_type,
      prescription_id: existingMedication.prescription_id,
      refills_remaining: existingMedication.refills_remaining,
      next_due_date: existingMedication.next_due_date ? new Date(existingMedication.next_due_date) : undefined
    } : {
      medication_name: '',
      dosage: '',
      dosage_unit: '',
      frequency: MedicationFrequency.DAILY,
      medication_type: MedicationType.TREATMENT,
      start_date: new Date(),
    }
  });
  
  // Calculate next due date when frequency or start date changes
  useEffect(() => {
    const startDate = form.getValues('start_date');
    const frequency = form.getValues('frequency');
    
    if (startDate && frequency) {
      const nextDueDate = calculateNextDueDate(startDate, frequency);
      form.setValue('next_due_date', nextDueDate);
    }
  }, [form.watch('frequency'), form.watch('start_date')]);
  
  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add medications.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const medicationData: MedicationFormData = {
        dog_id: dogId,
        medication_name: data.medication_name,
        dosage: data.dosage,
        dosage_unit: data.dosage_unit,
        frequency: data.frequency,
        route: data.route,
        start_date: data.start_date,
        end_date: data.end_date,
        notes: data.notes,
        medication_type: data.medication_type,
        prescription_id: data.prescription_id,
        refills_remaining: data.refills_remaining,
        next_due_date: data.next_due_date
      };
      
      if (existingMedication) {
        await updateMedicationRecord(existingMedication.id, medicationData, user.id);
        toast({
          title: "Medication Updated",
          description: `${data.medication_name} has been updated successfully.`
        });
      } else {
        await createMedicationRecord(medicationData, user.id);
        toast({
          title: "Medication Added",
          description: `${data.medication_name} has been added to the medication list.`
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving medication:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save medication",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            name="dosage_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="tablet">tablet</SelectItem>
                    <SelectItem value="capsule">capsule</SelectItem>
                    <SelectItem value="drop">drop</SelectItem>
                    <SelectItem value="unit">unit</SelectItem>
                    <SelectItem value="application">application</SelectItem>
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
                    <SelectItem value={MedicationFrequency.DAILY}>Daily</SelectItem>
                    <SelectItem value={MedicationFrequency.TWICE_DAILY}>Twice Daily</SelectItem>
                    <SelectItem value={MedicationFrequency.WEEKLY}>Weekly</SelectItem>
                    <SelectItem value={MedicationFrequency.BIWEEKLY}>Biweekly</SelectItem>
                    <SelectItem value={MedicationFrequency.MONTHLY}>Monthly</SelectItem>
                    <SelectItem value={MedicationFrequency.QUARTERLY}>Quarterly</SelectItem>
                    <SelectItem value={MedicationFrequency.ANNUALLY}>Annually</SelectItem>
                    <SelectItem value={MedicationFrequency.AS_NEEDED}>As Needed</SelectItem>
                    <SelectItem value={MedicationFrequency.CUSTOM}>Custom</SelectItem>
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
                    <SelectItem value={MedicationRoute.ORAL}>Oral</SelectItem>
                    <SelectItem value={MedicationRoute.INJECTION}>Injection</SelectItem>
                    <SelectItem value={MedicationRoute.TOPICAL}>Topical</SelectItem>
                    <SelectItem value={MedicationRoute.OPHTHALMIC}>Ophthalmic (Eye)</SelectItem>
                    <SelectItem value={MedicationRoute.OTIC}>Otic (Ear)</SelectItem>
                    <SelectItem value={MedicationRoute.NASAL}>Nasal</SelectItem>
                    <SelectItem value={MedicationRoute.RECTAL}>Rectal</SelectItem>
                    <SelectItem value={MedicationRoute.INHALATION}>Inhalation</SelectItem>
                    <SelectItem value={MedicationRoute.OTHER}>Other</SelectItem>
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
                    <SelectItem value={MedicationType.PREVENTATIVE}>Preventative</SelectItem>
                    <SelectItem value={MedicationType.PRESCRIPTION}>Prescription</SelectItem>
                    <SelectItem value={MedicationType.SUPPLEMENT}>Supplement</SelectItem>
                    <SelectItem value={MedicationType.TREATMENT}>Treatment</SelectItem>
                    <SelectItem value={MedicationType.VACCINE}>Vaccine</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {form.watch('medication_type') === MedicationType.PRESCRIPTION && (
            <FormField
              control={form.control}
              name="prescription_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prescription ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter prescription ID" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        
        {form.watch('medication_type') === MedicationType.PRESCRIPTION && (
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
                    placeholder="Enter number of refills" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                    value={field.value === undefined ? '' : field.value}
                  />
                </FormControl>
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
                <Textarea 
                  placeholder="Add any notes about this medication" 
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {existingMedication ? 'Update' : 'Add'} Medication
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MedicationForm;
