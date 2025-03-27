
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
  
  // Set up form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medication_name: existingMedication?.medication_name || '',
      dosage: existingMedication?.dosage || '',
      dosage_unit: existingMedication?.dosage_unit || '',
      frequency: existingMedication?.frequency || MedicationFrequency.DAILY,
      route: existingMedication?.route || undefined,
      start_date: existingMedication?.start_date 
        ? new Date(existingMedication.start_date) 
        : new Date(),
      end_date: existingMedication?.end_date 
        ? new Date(existingMedication.end_date) 
        : undefined,
      notes: existingMedication?.notes || '',
      medication_type: existingMedication?.medication_type || MedicationType.TREATMENT,
      prescription_id: existingMedication?.prescription_id || '',
      refills_remaining: existingMedication?.refills_remaining || 0,
      next_due_date: existingMedication?.next_due_date 
        ? new Date(existingMedication.next_due_date)
        : undefined
    }
  });
  
  // Watch for changes to calculate next due date
  const frequency = form.watch('frequency');
  const startDate = form.watch('start_date');
  
  // Update next due date when frequency or start date changes
  useEffect(() => {
    if (startDate) {
      const nextDueDate = calculateNextDueDate(startDate, frequency);
      form.setValue('next_due_date', nextDueDate);
    }
  }, [frequency, startDate, form]);
  
  // Show more fields based on medication type
  const medicationType = form.watch('medication_type');
  const showPrescriptionFields = medicationType === MedicationType.PRESCRIPTION;
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user?.id) {
      toast({
        title: 'User not authenticated',
        description: 'You must be logged in to add medications',
        variant: 'destructive'
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
        // Update existing medication
        await updateMedicationRecord(existingMedication.id, medicationData, user.id);
        toast({
          title: 'Medication updated',
          description: `${data.medication_name} has been updated successfully.`
        });
      } else {
        // Create new medication
        await createMedicationRecord(medicationData, user.id);
        toast({
          title: 'Medication added',
          description: `${data.medication_name} has been added to the dog's record.`
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving medication:', error);
      toast({
        title: 'Error saving medication',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="medication_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage</FormLabel>
                <FormControl>
                  <Input placeholder="Dosage amount" {...field} />
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
                <FormControl>
                  <Input placeholder="mg, ml, etc." {...field} />
                </FormControl>
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
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
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
                          <span>No end date</span>
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
        
        <FormField
          control={form.control}
          name="next_due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Next Due Date (Calculated)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-muted",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled
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
                    <p className="text-sm text-muted-foreground">
                      This date is calculated automatically based on the frequency and start date.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
              <FormDescription>
                The next due date is calculated based on the frequency and start date.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {showPrescriptionFields && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/30">
            <FormField
              control={form.control}
              name="prescription_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prescription ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter prescription ID" {...field} />
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
                      placeholder="Number of refills"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value || '0'))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter any additional notes about this medication"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
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
            {existingMedication ? 'Update' : 'Save'} Medication
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MedicationForm;
