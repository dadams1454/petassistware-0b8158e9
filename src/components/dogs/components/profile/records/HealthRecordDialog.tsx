
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { HealthRecord } from '@/types/dog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Import form field components
import VisitDateField from './form-fields/VisitDateField';
import VetNameField from './form-fields/VetNameField';
import RecordTypeField from './form-fields/RecordTypeField';
import TitleField from './form-fields/TitleField';
import DescriptionField from './form-fields/DescriptionField';
import NextDueDateField from './form-fields/NextDueDateField';
import DialogFooterButtons from './form-fields/DialogFooterButtons';

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
            <VisitDateField form={form} />
            <VetNameField form={form} />
            <RecordTypeField form={form} />
            <TitleField form={form} />
            <DescriptionField form={form} />
            
            {form.watch('record_type') === 'vaccination' && (
              <NextDueDateField form={form} />
            )}
            
            <DialogFooter className="pt-4">
              <DialogFooterButtons 
                onCancel={() => onOpenChange(false)}
                isEditing={!!record}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecordDialog;
