
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LitterDatePicker from '../LitterDatePicker';
import DogSelector from '../DogSelector';

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form }) => {
  // Calculate the total puppies whenever male or female count changes
  useEffect(() => {
    const maleCount = form.watch('male_count') || 0;
    const femaleCount = form.watch('female_count') || 0;
    form.setValue('puppy_count', maleCount + femaleCount);
  }, [form.watch('male_count'), form.watch('female_count')]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="litter_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Litter Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter litter name" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <LitterDatePicker 
          form={form} 
          name="birth_date" 
          label="Birth Date" 
        />
        <FormDescription className="col-span-2 -mt-4 text-sm">
          If this is a planned litter and there's no birth date yet, you can leave it blank. The system will use today's date temporarily and you can update it later.
        </FormDescription>

        <LitterDatePicker 
          form={form} 
          name="expected_go_home_date" 
          label="Expected Go Home Date" 
        />

        <DogSelector 
          form={form} 
          name="dam_id" 
          label="Dam" 
          filterGender="Female" 
        />

        <DogSelector 
          form={form} 
          name="sire_id" 
          label="Sire" 
          filterGender="Male" 
        />

        <FormField
          control={form.control}
          name="male_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Male Puppies</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  min="0"
                  {...field}
                  onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="female_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Female Puppies</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  min="0"
                  {...field}
                  onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="puppy_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Puppies</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  min="0"
                  {...field}
                  disabled
                  className="bg-muted"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter any notes about the litter" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoTab;
