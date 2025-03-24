
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { HealthRecord } from '../../types/healthRecord';

// Define schema for health record form
const healthRecordSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  record_type: z.enum(['vaccination', 'examination', 'medication', 'surgery', 'observation', 'other']),
  visit_date: z.string().min(1, 'Visit date is required'),
  vet_name: z.string().optional(),
  performed_by: z.string().optional(),
  next_due_date: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type HealthRecordFormValues = z.infer<typeof healthRecordSchema>;

interface HealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: HealthRecord | null;
  onSave: (data: HealthRecordFormValues) => void;
}

const HealthRecordDialog: React.FC<HealthRecordDialogProps> = ({
  open,
  onOpenChange,
  record,
  onSave,
}) => {
  const isEditMode = !!record;
  const form = useForm<HealthRecordFormValues>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      title: record?.title || '',
      record_type: record?.record_type || 'examination',
      visit_date: record?.visit_date ? record.visit_date.split('T')[0] : new Date().toISOString().split('T')[0],
      vet_name: record?.vet_name || '',
      performed_by: record?.performed_by || '',
      next_due_date: record?.next_due_date ? record.next_due_date.split('T')[0] : '',
      description: record?.description || '',
      notes: record?.notes || '',
    },
  });

  const onSubmit = (data: HealthRecordFormValues) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Health Record' : 'Add Health Record'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="record_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select record type" />
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title of the record" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visit_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visit Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="next_due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Due Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vet_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veterinarian Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of the vet" {...field} />
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
                    <FormLabel>Performed By</FormLabel>
                    <FormControl>
                      <Input placeholder="Who performed this procedure" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the health record"
                      className="resize-none"
                      {...field}
                    />
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
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecordDialog;
