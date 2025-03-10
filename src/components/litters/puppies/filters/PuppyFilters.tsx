
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import PuppyStatusFilter from './PuppyStatusFilter';
import PuppyGenderFilter from './PuppyGenderFilter';
import PuppyColorFilter from './PuppyColorFilter';

export interface PuppyFiltersProps {
  filters: {
    search: string;
    status: string[];
    gender: string[];
    color: string[];
  };
  onFilterChange: (key: string, value: any) => void;
  availableColors: string[];
}

const PuppyFilters: React.FC<PuppyFiltersProps> = ({ 
  filters, 
  onFilterChange,
  availableColors
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search puppies..."
          className="pl-8"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PuppyStatusFilter 
          selectedStatuses={filters.status} 
          onChange={(value) => onFilterChange('status', value)} 
        />
        
        <PuppyGenderFilter 
          selectedGenders={filters.gender} 
          onChange={(value) => onFilterChange('gender', value)} 
        />
        
        <PuppyColorFilter 
          selectedColors={filters.color} 
          availableColors={availableColors}
          onChange={(value) => onFilterChange('color', value)} 
        />
      </div>
    </div>
  );
};

export default PuppyFilters;
