
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { DialogFooter } from '@/components/ui/dialog';

// Form schema for adding a new vaccination
const vaccinationSchema = z.object({
  vaccination_type: z.string({
    required_error: "Vaccination type is required",
  }),
  vaccination_date: z.date({
    required_error: "Vaccination date is required",
  }),
  administered_by: z.string().optional(),
  lot_number: z.string().optional(),
  notes: z.string().optional(),
  is_completed: z.boolean().default(true),
  requires_followup: z.boolean().default(false),
  followup_date: z.date().optional(),
});

type VaccinationFormValues = z.infer<typeof vaccinationSchema>;

interface AddVaccinationFormProps {
  puppyId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AddVaccinationForm: React.FC<AddVaccinationFormProps> = ({
  puppyId,
  onSubmit,
  onCancel,
}) => {
  // Define default values for the form
  const defaultValues: Partial<VaccinationFormValues> = {
    vaccination_date: new Date(),
    is_completed: true,
    requires_followup: false,
  };

  const form = useForm<VaccinationFormValues>({
    resolver: zodResolver(vaccinationSchema),
    defaultValues,
  });

  const handleSubmit = (data: VaccinationFormValues) => {
    const formattedData = {
      puppy_id: puppyId,
      vaccination_type: data.vaccination_type,
      vaccination_date: format(data.vaccination_date, 'yyyy-MM-dd'),
      administered_by: data.administered_by,
      lot_number: data.lot_number,
      notes: data.notes,
      is_completed: data.is_completed,
      requires_followup: data.requires_followup,
      followup_date: data.followup_date ? format(data.followup_date, 'yyyy-MM-dd') : undefined,
    };
    
    onSubmit(formattedData);
  };

  // Watch if follow-up is required to conditionally show the follow-up date field
  const requiresFollowup = form.watch('requires_followup');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vaccination_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vaccination Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vaccination type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DHPP">DHPP</SelectItem>
                  <SelectItem value="Bordatella">Bordatella</SelectItem>
                  <SelectItem value="Rabies">Rabies</SelectItem>
                  <SelectItem value="Leptospirosis">Leptospirosis</SelectItem>
                  <SelectItem value="Canine Influenza">Canine Influenza</SelectItem>
                  <SelectItem value="Lyme Disease">Lyme Disease</SelectItem>
                  <SelectItem value="Deworming">Deworming</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vaccination_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Vaccination Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value && "text-muted-foreground"
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
            name="administered_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Administered By</FormLabel>
                <FormControl>
                  <Input placeholder="Veterinarian or Technician" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="lot_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lot Number</FormLabel>
              <FormControl>
                <Input placeholder="Vaccination lot number" {...field} />
              </FormControl>
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
                  placeholder="Additional information" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="is_completed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Completed</FormLabel>
                  <FormDescription>
                    Mark as complete
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
            name="requires_followup"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Follow-up</FormLabel>
                  <FormDescription>
                    Needs follow-up
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
        </div>
        
        {requiresFollowup && (
          <FormField
            control={form.control}
            name="followup_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Follow-up Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value && "text-muted-foreground"
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
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the next vaccination is due
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Vaccination</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddVaccinationForm;
