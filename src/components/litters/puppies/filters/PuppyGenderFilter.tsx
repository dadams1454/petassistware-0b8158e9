
import React from 'react';
import { Male, Female, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { genderOptions } from '../constants';
import { Checkbox } from '@/components/ui/checkbox';

interface PuppyGenderFilterProps {
  selectedGenders: string[];
  onChange: (genders: string[]) => void;
}

const PuppyGenderFilter: React.FC<PuppyGenderFilterProps> = ({ 
  selectedGenders, 
  onChange 
}) => {
  const toggleGender = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      onChange(selectedGenders.filter(g => g !== gender));
    } else {
      onChange([...selectedGenders, gender]);
    }
  };

  const clearFilters = () => {
    onChange([]);
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'Male':
        return <Male className="h-4 w-4 text-blue-500" />;
      case 'Female':
        return <Female className="h-4 w-4 text-pink-500" />;
      default:
        return null;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex justify-between w-full">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Gender</span>
          </div>
          {selectedGenders.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedGenders.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="space-y-4">
          <div className="font-medium">Puppy Gender</div>
          <div className="space-y-2">
            {genderOptions.map((gender) => (
              <div key={gender.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`gender-${gender.value}`}
                  checked={selectedGenders.includes(gender.value)}
                  onCheckedChange={() => toggleGender(gender.value)}
                />
                <label
                  htmlFor={`gender-${gender.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  {getGenderIcon(gender.value)}
                  {gender.label}
                </label>
              </div>
            ))}
          </div>
          {selectedGenders.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PuppyGenderFilter;
