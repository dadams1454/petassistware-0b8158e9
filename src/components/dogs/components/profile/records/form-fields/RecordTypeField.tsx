
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { HealthRecordType, HealthRecordTypeEnum } from '@/types/health-enums';

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
                <SelectItem value={HealthRecordTypeEnum.EXAMINATION}>Examination</SelectItem>
                <SelectItem value={HealthRecordTypeEnum.VACCINATION}>Vaccination</SelectItem>
                <SelectItem value={HealthRecordTypeEnum.MEDICATION}>Medication</SelectItem>
                <SelectItem value={HealthRecordTypeEnum.SURGERY}>Surgery</SelectItem>
                <SelectItem value={HealthRecordTypeEnum.TEST}>Test</SelectItem>
                <SelectItem value={HealthRecordTypeEnum.IMAGING}>Imaging</SelectItem>
                <SelectItem value={HealthRecordTypeEnum.DEWORMING}>Deworming</SelectItem>
                <SelectItem value={HealthRecordTypeEnum.OTHER}>Other</SelectItem>
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
