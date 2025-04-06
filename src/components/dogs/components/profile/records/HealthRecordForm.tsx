
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { HealthRecord, HealthRecordTypeEnum, stringToHealthRecordType } from '@/types/health';
import RecordTypeField from './form-fields/RecordTypeField';
import TitleField from './form-fields/TitleField';
import VisitDateField from './form-fields/VisitDateField';
import VetNameField from './form-fields/VetNameField';
import NotesField from './form-fields/NotesField';
import NextDueDateField from './form-fields/NextDueDateField';
import DocumentUrlField from './form-fields/DocumentUrlField';
import DialogFooterButtons from './form-fields/DialogFooterButtons';

// Health record form schema
const healthRecordSchema = z.object({
  record_type: z.string({
    required_error: 'Please select a record type',
  }),
  title: z.string().min(1, 'Title is required'),
  visit_date: z.date({
    required_error: 'Please select a date',
  }),
  vet_name: z.string().min(1, 'Veterinarian name is required'),
  record_notes: z.string().optional(),
  next_due_date: z.date().optional().nullable(),
  document_url: z.string().url().optional().or(z.literal('')),
  
  // Field groups for specific record types
  // Vaccination
  vaccine_name: z.string().optional(),
  manufacturer: z.string().optional(),
  lot_number: z.string().optional(),
  
  // Medication
  medication_name: z.string().optional(),
  dosage: z.coerce.number().optional(),
  dosage_unit: z.string().optional(),
  frequency: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  duration: z.coerce.number().optional(),
  duration_unit: z.string().optional(),
  administration_route: z.string().optional(),
  
  // Examination
  examination_type: z.string().optional(),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  follow_up_date: z.date().optional().nullable(),
  
  // Surgery
  procedure_name: z.string().optional(),
  surgeon: z.string().optional(),
  anesthesia_used: z.string().optional(),
  recovery_notes: z.string().optional(),
});

interface HealthRecordFormProps {
  onSubmit: (data: Partial<HealthRecord>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<HealthRecord>;
  dogId?: string;
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData,
  dogId
}) => {
  const [recordType, setRecordType] = useState<string>(
    initialData?.record_type ? String(initialData.record_type) : HealthRecordTypeEnum.EXAMINATION
  );
  
  const form = useForm<z.infer<typeof healthRecordSchema>>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      record_type: initialData?.record_type ? String(initialData.record_type) : HealthRecordTypeEnum.EXAMINATION,
      title: initialData?.title || '',
      visit_date: initialData?.visit_date ? new Date(initialData.visit_date) : new Date(),
      vet_name: initialData?.vet_name || '',
      record_notes: initialData?.record_notes || '',
      next_due_date: initialData?.next_due_date ? new Date(initialData.next_due_date) : null,
      document_url: initialData?.document_url || '',
      
      // Vaccination
      vaccine_name: initialData?.vaccine_name || '',
      manufacturer: initialData?.manufacturer || '',
      lot_number: initialData?.lot_number || '',
      
      // Medication
      medication_name: initialData?.medication_name || '',
      dosage: initialData?.dosage || undefined,
      dosage_unit: initialData?.dosage_unit || '',
      frequency: initialData?.frequency || '',
      start_date: initialData?.start_date ? new Date(initialData.start_date) : undefined,
      end_date: initialData?.end_date ? new Date(initialData.end_date) : undefined,
      duration: initialData?.duration || undefined,
      duration_unit: initialData?.duration_unit || '',
      administration_route: initialData?.administration_route || '',
      
      // Examination
      examination_type: initialData?.examination_type || '',
      findings: initialData?.findings || '',
      recommendations: initialData?.recommendations || '',
      follow_up_date: initialData?.follow_up_date ? new Date(initialData.follow_up_date) : null,
      
      // Surgery
      procedure_name: initialData?.procedure_name || '',
      surgeon: initialData?.surgeon || '',
      anesthesia_used: initialData?.anesthesia_used || '',
      recovery_notes: initialData?.recovery_notes || '',
    }
  });
  
  const handleFormSubmit = (values: z.infer<typeof healthRecordSchema>) => {
    // Format dates to ISO strings
    const formattedData: Partial<HealthRecord> = {
      ...values,
      dog_id: dogId || initialData?.dog_id,
      record_type: stringToHealthRecordType(values.record_type),
      visit_date: values.visit_date.toISOString().split('T')[0],
      next_due_date: values.next_due_date ? values.next_due_date.toISOString().split('T')[0] : null,
      start_date: values.start_date ? values.start_date.toISOString().split('T')[0] : undefined,
      end_date: values.end_date ? values.end_date.toISOString().split('T')[0] : undefined,
      follow_up_date: values.follow_up_date ? values.follow_up_date.toISOString().split('T')[0] : null,
    };
    
    onSubmit(formattedData);
  };
  
  const handleRecordTypeChange = (value: string) => {
    setRecordType(value);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <RecordTypeField 
          form={form} 
          onTypeChange={handleRecordTypeChange} 
          disabled={!!initialData?.id}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TitleField form={form} />
          <VisitDateField form={form} />
        </div>
        
        <VetNameField form={form} />
        
        <NotesField form={form} />
        
        {/* Record type specific fields */}
        {recordType === HealthRecordTypeEnum.VACCINATION && (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-sm font-medium">Vaccination Details</h3>
            
            {/* Add vaccination-specific fields here */}
          </div>
        )}
        
        {recordType === HealthRecordTypeEnum.MEDICATION && (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-sm font-medium">Medication Details</h3>
            
            {/* Add medication-specific fields here */}
          </div>
        )}
        
        {recordType === HealthRecordTypeEnum.EXAMINATION && (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-sm font-medium">Examination Details</h3>
            
            {/* Add examination-specific fields here */}
          </div>
        )}
        
        {recordType === HealthRecordTypeEnum.SURGERY && (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-sm font-medium">Surgery Details</h3>
            
            {/* Add surgery-specific fields here */}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NextDueDateField form={form} />
          <DocumentUrlField form={form} />
        </div>
        
        <DialogFooterButtons
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          submitLabel={initialData?.id ? 'Update Record' : 'Add Record'}
        />
      </form>
    </Form>
  );
};

export default HealthRecordForm;
