
import React from 'react';
import { useDogsData } from '@/components/dogs/hooks/useDogsData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DogSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  filterSex?: 'male' | 'female';
  label?: string;
  disabled?: boolean;
}

export const DogSelector: React.FC<DogSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select a dog...',
  filterSex,
  label,
  disabled = false
}) => {
  const { dogs, isLoading: loading } = useDogsData();
  
  // Filter dogs by sex if specified
  const filteredDogs = filterSex 
    ? dogs.filter(dog => dog.gender === filterSex)
    : dogs;
  
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filteredDogs.map(dog => (
            <SelectItem key={dog.id} value={dog.id}>
              {dog.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DogSelector;
