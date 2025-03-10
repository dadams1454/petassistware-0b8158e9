
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';

interface DogSelectorProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  filterGender?: 'male' | 'female';
}

const DogSelector: React.FC<DogSelectorProps> = ({ form, name, label, filterGender }) => {
  const { data: dogs, isLoading } = useQuery({
    queryKey: ['dogs', filterGender],
    queryFn: async () => {
      let query = supabase
        .from('dogs')
        .select('id, name, breed, gender');
      
      if (filterGender) {
        query = query.eq('gender', filterGender);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || ""}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="">None Selected</SelectItem>
              {dogs?.map(dog => (
                <SelectItem key={dog.id} value={dog.id}>
                  {dog.name} ({dog.breed})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DogSelector;
