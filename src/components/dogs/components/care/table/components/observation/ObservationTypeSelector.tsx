
import React from 'react';
import { ObservationType } from './ObservationDialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, ThermometerSnowflake, Activity, MessageSquare } from 'lucide-react';
import { Label } from '@/components/ui/label';

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
  return (
    <div>
      <Label className="block mb-2">Observation Type</Label>
      <RadioGroup
        value={value}
        onValueChange={(newValue) => onChange(newValue as ObservationType)}
        className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-4 gap-1'}`}
      >
        <div className="flex items-center space-x-2 border rounded p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
             onClick={() => onChange('accident')}>
          <RadioGroupItem value="accident" id="accident" />
          <Label htmlFor="accident" className="flex items-center cursor-pointer w-full">
            <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
            <span>Accident</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
             onClick={() => onChange('heat')}>
          <RadioGroupItem value="heat" id="heat" />
          <Label htmlFor="heat" className="flex items-center cursor-pointer w-full">
            <ThermometerSnowflake className="h-4 w-4 mr-1 text-red-500" />
            <span>Heat Signs</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
             onClick={() => onChange('behavior')}>
          <RadioGroupItem value="behavior" id="behavior" />
          <Label htmlFor="behavior" className="flex items-center cursor-pointer w-full">
            <Activity className="h-4 w-4 mr-1 text-blue-500" />
            <span>Behavior</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
             onClick={() => onChange('other')}>
          <RadioGroupItem value="other" id="other" />
          <Label htmlFor="other" className="flex items-center cursor-pointer w-full">
            <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
            <span>Other</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ObservationTypeSelector;
