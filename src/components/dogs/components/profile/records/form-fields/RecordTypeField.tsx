
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { HealthRecordTypeEnum } from '@/types';

interface RecordTypeFieldProps {
  form: UseFormReturn<any>;
  onTypeChange: (value: string) => void;
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
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onTypeChange(value);
            }}
            defaultValue={field.value}
            disabled={disabled}
          >
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
              <SelectItem value={HealthRecordTypeEnum.LABORATORY}>Laboratory</SelectItem>
              <SelectItem value={HealthRecordTypeEnum.PREVENTIVE}>Preventive Care</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RecordTypeField;
