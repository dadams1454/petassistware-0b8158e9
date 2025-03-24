
import React from 'react';
import { ObservationType } from './ObservationDialog';
import { AlertTriangle, ThermometerSnowflake, Activity, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ObservationTypeSelectorProps {
  value: ObservationType;
  onChange: (value: ObservationType) => void;
  isMobile?: boolean;
  activeCategory?: string;
}

const ObservationTypeSelector: React.FC<ObservationTypeSelectorProps> = ({
  value,
  onChange,
  isMobile = false,
  activeCategory = 'pottybreaks'
}) => {
  // Define the types for potty break observations only
  const types = [
    { value: 'accident', label: 'Accident', icon: AlertTriangle, color: 'text-amber-500' },
    { value: 'heat', label: 'Heat Signs', icon: ThermometerSnowflake, color: 'text-red-500' },
    { value: 'behavior', label: 'Behavior', icon: Activity, color: 'text-blue-500' },
    { value: 'other', label: 'Other', icon: MessageSquare, color: 'text-gray-500' }
  ];

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Observation Type</div>
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-4 gap-2'}`}>
        {types.map((type) => {
          const Icon = type.icon;
          const isSelected = value === type.value;
          
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value as ObservationType)}
              className={cn(
                "flex items-center justify-center flex-col h-20 p-2 rounded-lg border transition-all duration-200 text-sm gap-1",
                isSelected 
                  ? "border-primary bg-primary/10 font-medium" 
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-900/50"
              )}
            >
              <Icon className={cn("h-5 w-5", type.color)} />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ObservationTypeSelector;
