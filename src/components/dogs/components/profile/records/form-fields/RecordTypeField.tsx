
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { HealthRecordType } from '@/types/health';

interface RecordTypeFieldProps {
  form: UseFormReturn<any>;
  onTypeChange?: (value: string) => void;
  disabled?: boolean;
}

const RecordTypeField: React.FC<RecordTypeFieldProps> = ({ form, onTypeChange, disabled = false }) => {
  return (
    <FormField
      control={form.control}
      name="record_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Record Type</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                if (onTypeChange) onTypeChange(value);
              }}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={HealthRecordType.EXAMINATION}>Examination</SelectItem>
                <SelectItem value={HealthRecordType.VACCINATION}>Vaccination</SelectItem>
                <SelectItem value={HealthRecordType.MEDICATION}>Medication</SelectItem>
                <SelectItem value={HealthRecordType.SURGERY}>Surgery</SelectItem>
                <SelectItem value={HealthRecordType.TEST}>Test</SelectItem>
                <SelectItem value={HealthRecordType.IMAGING}>Imaging</SelectItem>
                <SelectItem value={HealthRecordType.DEWORMING}>Deworming</SelectItem>
                <SelectItem value={HealthRecordType.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RecordTypeField;
