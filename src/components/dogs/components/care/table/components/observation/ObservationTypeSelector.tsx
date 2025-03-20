
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Heart, Activity, MessageCircle } from 'lucide-react';

type ObservationType = 'accident' | 'heat' | 'behavior' | 'other';

interface ObservationTypeSelectorProps {
  value: ObservationType;
  onChange: (value: ObservationType) => void;
  isMobile?: boolean;
}

const ObservationTypeSelector: React.FC<ObservationTypeSelectorProps> = ({
  value,
  onChange,
  isMobile = false
}) => {
  return (
    <div>
      <Label htmlFor="observation-type">Observation Type</Label>
      <RadioGroup 
        value={value} 
        onValueChange={(value) => onChange(value as ObservationType)}
        className={`flex ${isMobile ? 'flex-wrap' : ''} gap-4 mt-2`}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="accident" id="accident" />
          <Label htmlFor="accident" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Accident
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="heat" id="heat" />
          <Label htmlFor="heat" className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500" />
            Heat Signs
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="behavior" id="behavior" />
          <Label htmlFor="behavior" className="flex items-center gap-1">
            <Activity className="h-4 w-4 text-blue-500" />
            Behavior
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="other" id="other" />
          <Label htmlFor="other" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4 text-gray-500" />
            Other
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ObservationTypeSelector;
