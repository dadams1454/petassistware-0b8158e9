
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDogs } from '@/hooks/useDogs';

interface DogSelectorProps {
  value?: string;
  onChange: (dogId: string) => void;
  placeholder?: string;
  excludeDogIds?: string[];
  genderFilter?: 'Male' | 'Female';
  className?: string;
  disabled?: boolean;
}

const DogSelector: React.FC<DogSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select a dog',
  excludeDogIds = [],
  genderFilter,
  className,
  disabled = false
}) => {
  const { dogs, isLoading } = useDogs();
  
  // Filter dogs based on criteria
  const filteredDogs = dogs.filter(dog => {
    if (excludeDogIds.includes(dog.id)) return false;
    if (genderFilter && dog.gender !== genderFilter) return false;
    return true;
  });
  
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filteredDogs.map(dog => (
          <SelectItem key={dog.id} value={dog.id}>
            {dog.name}
          </SelectItem>
        ))}
        
        {filteredDogs.length === 0 && (
          <SelectItem value="none" disabled>
            No dogs available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default DogSelector;
