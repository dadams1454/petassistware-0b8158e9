
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface DogSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  filterSex?: 'male' | 'female';
  label?: string;
}

export const DogSelector: React.FC<DogSelectorProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Select a dog...', 
  filterSex,
  label
}) => {
  const { data: dogs, isLoading } = useQuery({
    queryKey: ['dogs', filterSex],
    queryFn: async () => {
      let query = supabase
        .from('dogs')
        .select('id, name, breed, gender');
      
      if (filterSex) {
        // Map 'male' or 'female' to the actual DB values
        const genderValue = filterSex === 'male' ? 'Male' : 'Female';
        query = query.eq('gender', genderValue);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching dogs:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  const handleChange = (newValue: string) => {
    onChange(newValue === 'none' ? '' : newValue);
  };

  return (
    <div>
      {label && <div className="mb-2 text-sm font-medium">{label}</div>}
      <Select value={value || 'none'} onValueChange={handleChange} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">{placeholder}</SelectItem>
          {dogs?.map(dog => (
            <SelectItem key={dog.id} value={dog.id}>
              {dog.name} {dog.breed ? `(${dog.breed})` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DogSelector;
