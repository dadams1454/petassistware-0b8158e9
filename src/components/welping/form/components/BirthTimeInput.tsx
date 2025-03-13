
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormItem, FormLabel } from '@/components/ui/form';
import { WelpingPuppyFormData } from '../hooks/useWelpingPuppyForm';

interface BirthTimeInputProps {
  form: UseFormReturn<WelpingPuppyFormData>;
}

const BirthTimeInput: React.FC<BirthTimeInputProps> = ({ form }) => {
  return (
    <FormItem className="space-y-2">
      <FormLabel htmlFor="birth_time">Birth Time</FormLabel>
      <input
        id="birth_time"
        type="time"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        {...form.register("birth_time")}
      />
    </FormItem>
  );
};

export default BirthTimeInput;
