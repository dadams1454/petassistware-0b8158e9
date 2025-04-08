
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dog } from '@/types/dog';

interface DogSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  genderFilter?: 'Male' | 'Female';
  disabled?: boolean;
  filterSex?: string; // For backward compatibility
}

export const DogSelector: React.FC<DogSelectorProps> = ({
  value = '',
  onChange,
  placeholder = "Select a dog",
  genderFilter,
  filterSex, // Added for backward compatibility
  disabled = false
}) => {
  // Use filterSex as fallback for genderFilter for backward compatibility
  const effectiveGenderFilter = genderFilter || (filterSex as 'Male' | 'Female' | undefined);
  
  // Fetch all dogs, filtering by gender if specified
  const { data: dogs, isLoading } = useQuery({
    queryKey: ['dogs', effectiveGenderFilter],
    queryFn: async () => {
      let query = supabase
        .from('dogs')
        .select('id, name, breed, gender, color, microchip_number')
        .order('name');
      
      if (effectiveGenderFilter) {
        query = query.eq('gender', effectiveGenderFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching dogs:', error);
        throw error;
      }
      
      return (data || []) as Dog[];
    }
  });

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={disabled || isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Loading dogs...
          </SelectItem>
        ) : !dogs || dogs.length === 0 ? (
          <SelectItem value="none" disabled>
            No dogs available
          </SelectItem>
        ) : (
          dogs.map((dog) => (
            <SelectItem key={dog.id} value={dog.id}>
              {dog.name} {dog.breed ? `(${dog.breed})` : ''}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default DogSelector;
