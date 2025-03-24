
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { HealthRecord, HealthRecordType } from '@/types/dog';
import { useHealthRecords } from '../../../hooks/useHealthRecords';

// Define form validation schema
const healthRecordSchema = z.object({
  date: z.date({
    required_error: 'Date is required',
  }),
  record_type: z.enum(['vaccination', 'examination', 'medication', 'surgery', 'observation', 'other'], {
    required_error: 'Record type is required',
  }),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  performed_by: z.string().min(1, 'Performed by is required'),
  has_next_due_date: z.boolean().default(false),
  next_due_date: z.date().optional(),
});

type HealthRecordFormValues = z.infer<typeof healthRecordSchema>;

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
  const { addHealthRecord, updateHealthRecord } = useHealthRecords(dogId);
  
  // Initialize form with existing record data or defaults
  const form = useForm<HealthRecordFormValues>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: record ? {
      date: new Date(record.date),
      record_type: record.record_type,
      title: record.title,
      description: record.description,
      performed_by: record.performed_by,
      has_next_due_date: !!record.next_due_date,
      next_due_date: record.next_due_date ? new Date(record.next_due_date) : undefined,
    } : {
      date: new Date(),
      record_type: 'vaccination',
      title: '',
      description: '',
      performed_by: '',
      has_next_due_date: false,
    },
  });
  
  // Watch for has_next_due_date changes
  const hasNextDueDate = form.watch('has_next_due_date');
  
  const onSubmit = async (values: HealthRecordFormValues) => {
    try {
      const healthRecordData: Omit<HealthRecord, 'id' | 'created_at'> | HealthRecord = {
        dog_id: dogId,
        date: values.date.toISOString(),
        record_type: values.record_type as HealthRecordType,
        title: values.title,
        description: values.description || '',
        performed_by: values.performed_by,
        next_due_date: values.has_next_due_date && values.next_due_date 
          ? values.next_due_date.toISOString() 
          : undefined,
      };

      if (record) {
        // Update existing record
        await updateHealthRecord.mutateAsync({
          id: record.id,
          ...healthRecordData
        });
      } else {
        // Add new record
        await addHealthRecord.mutateAsync(healthRecordData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving health record:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {record ? 'Edit Health Record' : 'Add Health Record'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="record_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record Type*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="examination">Examination</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="observation">Observation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date*</FormLabel>
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="pointer-events-auto"
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Rabies Vaccination, Annual Checkup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="performed_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Performed By*</FormLabel>
                  <FormControl>
                    <Input placeholder="Veterinarian or staff name" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Details about the health record"
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="has_next_due_date"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Set Next Due Date</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            {hasNextDueDate && (
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
                          disabled={(date) => date <= new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addHealthRecord.isPending || updateHealthRecord.isPending}
              >
                {addHealthRecord.isPending || updateHealthRecord.isPending 
                  ? 'Saving...' 
                  : 'Save Record'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecordDialog;
