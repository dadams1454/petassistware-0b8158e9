
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WelpingPuppyFormData } from '../hooks/useWelpingPuppyForm';
import { Clock } from 'lucide-react';

interface BirthTimeInputProps {
  form: UseFormReturn<WelpingPuppyFormData>;
}

const BirthTimeInput: React.FC<BirthTimeInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="birth_time"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <FormLabel className="text-xs text-muted-foreground">Birth Time</FormLabel>
          </div>
          <FormControl>
            <Input
              type="time"
              {...field}
              className="h-10 w-full rounded-md border border-input"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default BirthTimeInput;
