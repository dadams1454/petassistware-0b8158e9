
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Check, X } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
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
  return (
    <Popover open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Filter size={14} />
          <span className="hidden sm:inline text-xs">Filter Events</span>
          <span className="inline sm:hidden text-xs">Filter</span>
          {activeFilters.length > 0 && activeFilters.length < EVENT_TYPES.length && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="flex justify-between mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-6 px-2"
            onClick={selectAllFilters}
          >
            Select All
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-6 px-2"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        </div>
        
        <div className="space-y-1 max-h-[250px] overflow-y-auto py-1">
          {EVENT_TYPES.map(eventType => {
            const { bg, text } = EVENT_COLORS[eventType];
            const isActive = activeFilters.includes(eventType);
            
            return (
              <Button
                key={eventType}
                variant="ghost"
                size="sm"
                className={`w-full justify-start h-7 px-2 ${isActive ? 'bg-accent' : ''}`}
                onClick={() => toggleFilter(eventType)}
              >
                <div className="flex items-center w-full">
                  <span className={`mr-2 h-4 w-4 rounded-full flex items-center justify-center ${bg}`}>
                    {isActive && <Check size={10} className={text} />}
                  </span>
                  <span className="text-xs truncate">{eventType}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EventTypeFilters;
