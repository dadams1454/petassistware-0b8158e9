
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilterX } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DateRange } from "react-day-picker";
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface FilterControlsProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  filterBreed: string | undefined;
  setFilterBreed: (breed: string | undefined) => void;
  resetFilters: () => void;
  breeds: Array<{ id: string, name: string }> | undefined;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  dateRange,
  setDateRange,
  filterBreed,
  setFilterBreed,
  resetFilters,
  breeds
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <DateRangePicker
        dateRange={dateRange}
        onSelect={setDateRange}
      />
      
      <Select
        value={filterBreed}
        onValueChange={setFilterBreed}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by breed" />
        </SelectTrigger>
        <SelectContent>
          {breeds?.map(breed => (
            <SelectItem key={breed.id} value={breed.id}>{breed.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        onClick={resetFilters}
        size="sm"
        className="flex items-center gap-1"
      >
        <FilterX className="h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  );
};

export default FilterControls;
