
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EventTypeFiltersProps {
  eventTypes: string[];
  activeFilters: string[];
  onFilterChange: (eventType: string) => void;
  onClearFilters: () => void;
}

const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    'Vet Appointment': 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
    'Breeding': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    'Whelping': 'bg-pink-100 text-pink-800 hover:bg-pink-200',
    'Vaccination': 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
    'Grooming': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
    'Training': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    'Show': 'bg-lime-100 text-lime-800 hover:bg-lime-200',
    'Other': 'bg-slate-100 text-slate-800 hover:bg-slate-200',
  };
  
  return typeColors[type] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
};

const getActiveTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    'Vet Appointment': 'bg-cyan-600 text-white hover:bg-cyan-700',
    'Breeding': 'bg-purple-600 text-white hover:bg-purple-700',
    'Whelping': 'bg-pink-600 text-white hover:bg-pink-700',
    'Vaccination': 'bg-emerald-600 text-white hover:bg-emerald-700',
    'Grooming': 'bg-indigo-600 text-white hover:bg-indigo-700',
    'Training': 'bg-amber-600 text-white hover:bg-amber-700',
    'Show': 'bg-lime-600 text-white hover:bg-lime-700',
    'Other': 'bg-slate-600 text-white hover:bg-slate-700',
  };
  
  return typeColors[type] || 'bg-gray-600 text-white hover:bg-gray-700';
};

const EventTypeFilters: React.FC<EventTypeFiltersProps> = ({ 
  eventTypes,
  activeFilters,
  onFilterChange,
  onClearFilters
}) => {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {eventTypes.map(type => (
          <Badge
            key={type}
            variant="outline"
            className={`cursor-pointer ${activeFilters.includes(type) 
              ? getActiveTypeColor(type) 
              : getTypeColor(type)}`}
            onClick={() => onFilterChange(type)}
          >
            {type}
          </Badge>
        ))}
      </div>
      
      {activeFilters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-auto py-1 px-2 text-xs"
          onClick={onClearFilters}
        >
          <X className="h-3 w-3 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default EventTypeFilters;
