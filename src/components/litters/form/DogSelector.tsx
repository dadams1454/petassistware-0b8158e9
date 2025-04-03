
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
  filterGender?: 'Male' | 'Female';
  onChange?: (dogId: string) => void;
}

const DogSelector: React.FC<DogSelectorProps> = ({ form, name, label, filterGender, onChange }) => {
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
      
      if (error) {
        console.error('Error fetching dogs:', error);
        throw error;
      }
      
      // Cast the gender appropriately for the Dog type
      return data?.map(dog => ({
        ...dog,
        gender: dog.gender as 'Male' | 'Female'
      })) || [];
    }
  });

  // For debugging
  console.log('DogSelector - Available dogs:', dogs);
  console.log('DogSelector - Current value:', form.getValues(name));

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              onChange && onChange(value);
            }} 
            value={field.value || "none"}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label || 'Dog'}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">None Selected</SelectItem>
              {dogs?.map(dog => (
                <SelectItem key={dog.id} value={dog.id}>
                  {dog.name} ({dog.breed || 'Unknown'})
                  {dog.gender ? ` • ${dog.gender}` : ''}
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
