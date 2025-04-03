
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { HealthRecordTypeEnum } from '@/types/health';

interface RecordTypeFieldProps {
  form: UseFormReturn<any>;
}

const RecordTypeField: React.FC<RecordTypeFieldProps> = ({ form }) => {
  return (
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
              <SelectItem value={HealthRecordTypeEnum.EXAMINATION}>Examination</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.VACCINATION}>Vaccination</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.MEDICATION}>Medication</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.SURGERY}>Surgery</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.DENTAL}>Dental</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.ALLERGY}>Allergy</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.TEST}>Test/Screening</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.OBSERVATION}>Observation</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.DEWORMING}>Deworming</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.GROOMING}>Grooming</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            The type of health record
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RecordTypeField;
