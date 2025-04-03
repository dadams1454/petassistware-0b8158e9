
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HealthRecordTypeEnum } from '@/types/health';

interface RecordTypeFieldProps {
  form: any;
  onTypeChange: (value: string) => void;
  disabled?: boolean;
}

const RecordTypeField: React.FC<RecordTypeFieldProps> = ({ 
  form, 
  onTypeChange,
  disabled = false
}) => {
  return (
    <FormField
      control={form.control}
      name="record_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Record Type</FormLabel>
          <Select
            disabled={disabled}
            onValueChange={(value) => {
              field.onChange(value);
              onTypeChange(value);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={HealthRecordTypeEnum.Examination}>Examination</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.Vaccination}>Vaccination</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.Medication}>Medication</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.Surgery}>Surgery</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.Dental}>Dental</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.Allergy}>Allergy</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.Test}>Test</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.Observation}>Observation</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.Deworming}>Deworming</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.Grooming}>Grooming</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.Other}>Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RecordTypeField;
