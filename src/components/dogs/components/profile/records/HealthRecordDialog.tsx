
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { HealthRecord } from '@/types/dog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  visit_date: z.date({
    required_error: "A visit date is required",
  }),
  vet_name: z.string().min(2, {
    message: "Vet name must be at least 2 characters",
  }),
  record_type: z.enum(['examination', 'vaccination', 'medication', 'surgery', 'observation', 'other'], {
    required_error: "Record type is required",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters",
  }),
  description: z.string().optional(),
  next_due_date: z.date().optional(),
});

interface HealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  record: HealthRecord | null;
  onSave: () => void;
}

const HealthRecordDialog: React.FC<HealthRecordDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  record,
  onSave
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visit_date: record ? new Date(record.date) : new Date(),
      vet_name: record?.performed_by || '',
      record_type: record?.record_type || 'examination',
      title: record?.title || '',
      description: record?.description || '',
      next_due_date: record?.next_due_date ? new Date(record.next_due_date) : undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const recordData = {
        dog_id: dogId,
        visit_date: values.visit_date.toISOString().split('T')[0],
        vet_name: values.vet_name,
        record_notes: `${values.title}\n\n${values.description || ''}${values.record_type !== 'examination' ? `\n\nType: ${values.record_type}` : ''}`,
      };

      if (record) {
        // Update existing record
        const { error } = await supabase
          .from('health_records')
          .update(recordData)
          .eq('id', record.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('health_records')
          .insert(recordData);
        
        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving health record:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the health record.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{record ? 'Edit Health Record' : 'Add Health Record'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="visit_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Visit Date</FormLabel>
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
                            <span>Select a date</span>
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
            <FormField
              control={form.control}
              name="vet_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veterinarian</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="record_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select record type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="examination">Examination</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="observation">Observation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of health record
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Annual Check-up" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Details about the visit or treatment" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('record_type') === 'vaccination' && (
              <FormField
                control={form.control}
                name="next_due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Next Due Date</FormLabel>
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
                              <span>Select a future date</span>
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
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
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
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {record ? 'Update Record' : 'Add Record'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecordDialog;
