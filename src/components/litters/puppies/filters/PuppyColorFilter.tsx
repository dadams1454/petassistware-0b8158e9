
import React from 'react';
import { Filter, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface PuppyColorFilterProps {
  selectedColors: string[];
  availableColors: string[];
  onChange: (colors: string[]) => void;
}

const PuppyColorFilter: React.FC<PuppyColorFilterProps> = ({ 
  selectedColors, 
  availableColors,
  onChange 
}) => {
  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onChange(selectedColors.filter(c => c !== color));
    } else {
      onChange([...selectedColors, color]);
    }
  };

  const clearFilters = () => {
    onChange([]);
  };

  // Default Newfoundland colors if no colors are provided
  const displayColors = availableColors.length > 0 ? availableColors : [
    'Black 007',
    'Brown 061',
    'Gray 100',
    'brown/white 063',
    'black/white 202'
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex justify-between w-full">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Color</span>
          </div>
          {selectedColors.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedColors.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="space-y-4">
          <div className="font-medium">Puppy Color</div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {displayColors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={selectedColors.includes(color)}
                  onCheckedChange={() => toggleColor(color)}
                />
                <label
                  htmlFor={`color-${color}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {color}
                </label>
              </div>
            ))}
          </div>
          {selectedColors.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PuppyColorFilter;
