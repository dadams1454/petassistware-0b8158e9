
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

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
              <SelectItem value="examination">Examination</SelectItem>
              <SelectItem value="vaccination">Vaccination</SelectItem>
              <SelectItem value="medication">Medication</SelectItem>
              <SelectItem value="surgery">Surgery</SelectItem>
              <SelectItem value="dental">Dental</SelectItem>
              <SelectItem value="allergy">Allergy</SelectItem>
              <SelectItem value="test">Test/Screening</SelectItem>
              <SelectItem value="observation">Observation</SelectItem>
              <SelectItem value="deworming">Deworming</SelectItem>
              <SelectItem value="grooming">Grooming</SelectItem>
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
  );
};

export default RecordTypeField;
