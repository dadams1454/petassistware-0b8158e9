
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WelpingPuppyFormData } from '../hooks/useWelpingPuppyForm';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface BirthTimeInputProps {
  form: UseFormReturn<WelpingPuppyFormData>;
}

const BirthTimeInput: React.FC<BirthTimeInputProps> = ({ form }) => {
  // Set the current time whenever the component mounts
  useEffect(() => {
    const currentTime = format(new Date(), 'HH:mm');
    form.setValue('birth_time', currentTime);
  }, [form]);

  return (
    <FormField
      control={form.control}
      name="birth_time"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <FormLabel className="text-xs text-muted-foreground">Birth Time (Current Time)</FormLabel>
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
