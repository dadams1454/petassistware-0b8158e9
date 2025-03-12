
import React from 'react';
import { Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { statusOptions } from '../constants';
import { Checkbox } from '@/components/ui/checkbox';

interface PuppyStatusFilterProps {
  selectedStatuses: string[];
  onChange: (statuses: string[]) => void;
}

const PuppyStatusFilter: React.FC<PuppyStatusFilterProps> = ({ 
  selectedStatuses, 
  onChange 
}) => {
  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onChange(selectedStatuses.filter(s => s !== status));
    } else {
      onChange([...selectedStatuses, status]);
    }
  };

  const clearFilters = () => {
    onChange([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex justify-between w-full">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Status</span>
          </div>
          {selectedStatuses.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedStatuses.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="space-y-4">
          <div className="font-medium">Puppy Status</div>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <div key={status.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status.value}`}
                  checked={selectedStatuses.includes(status.value)}
                  onCheckedChange={() => toggleStatus(status.value)}
                />
                <label
                  htmlFor={`status-${status.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {status.label}
                </label>
              </div>
            ))}
          </div>
          {selectedStatuses.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PuppyStatusFilter;
