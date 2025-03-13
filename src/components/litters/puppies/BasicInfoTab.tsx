
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import SelectInput from '@/components/dogs/form/SelectInput';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import PuppyPhotoUpload from './common/PuppyPhotoUpload';
import { PuppyFormData } from './types';

interface BasicInfoTabProps {
  form: UseFormReturn<PuppyFormData>;
  litterId?: string;
}

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];

const statusOptions = [
  { value: 'Available', label: 'Available' },
  { value: 'Reserved', label: 'Reserved' },
  { value: 'Sold', label: 'Sold' },
  { value: 'Kept', label: 'Kept' },
  { value: 'Deceased', label: 'Deceased' },
];

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form, litterId }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput 
          form={form} 
          name="name" 
          label="Puppy Name" 
          placeholder="Enter puppy name" 
        />
        
        <TextInput 
          form={form} 
          name="color" 
          label="Color/Markings" 
          placeholder="Describe the puppy's color and markings" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput 
          form={form} 
          name="gender" 
          label="Gender" 
          options={genderOptions} 
        />
        
        <SelectInput 
          form={form} 
          name="status" 
          label="Status" 
          options={statusOptions} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Birth Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarUI
                    mode="single"
                    selected={field.value as Date}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="birth_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      {litterId && (
        <PuppyPhotoUpload 
          form={form} 
          name="photo_url" 
          label="Puppy Photo" 
          litterId={litterId} 
        />
      )}
    </div>
  );
};

export default BasicInfoTab;
