
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { EVENT_TYPES, EVENT_COLORS } from '@/pages/Calendar';

interface EventTypeFiltersProps {
  activeFilters: string[];
  toggleFilter: (eventType: string) => void;
  selectAllFilters: () => void;
  clearAllFilters: () => void;
  filterMenuOpen: boolean;
  setFilterMenuOpen: (open: boolean) => void;
}

const EventTypeFilters: React.FC<EventTypeFiltersProps> = ({
  activeFilters,
  toggleFilter,
  selectAllFilters,
  clearAllFilters,
  filterMenuOpen,
  setFilterMenuOpen
}) => {
  // Function to get color styling for an event type
  const getEventTypeStyle = (eventType: string) => {
    return EVENT_COLORS[eventType] || EVENT_COLORS['Other'];
  };

  return (
    <Popover open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          Filter
          {activeFilters.length < EVENT_TYPES.length && (
            <Badge variant="secondary" className="ml-1">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter By Event Type</h4>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs px-2"
                onClick={selectAllFilters}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs px-2"
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {EVENT_TYPES.map(eventType => {
              const { bg, text } = getEventTypeStyle(eventType);
              return (
                <div key={eventType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-${eventType}`}
                    checked={activeFilters.includes(eventType)}
                    onCheckedChange={() => toggleFilter(eventType)}
                  />
                  <Label htmlFor={`filter-${eventType}`} className="flex items-center gap-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${bg} ${text}`}>
                      {eventType}
                    </span>
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EventTypeFilters;
