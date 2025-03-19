
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Heart, Activity, MessageCircle } from 'lucide-react';
import { ObservationType } from '../ObservationDialog';

interface RadioGroupOptionsProps {
  observationType: ObservationType;
  setObservationType: (type: ObservationType) => void;
}

const RadioGroupOptions: React.FC<RadioGroupOptionsProps> = ({
  observationType,
  setObservationType
}) => {
  return (
    <RadioGroup 
      value={observationType} 
      onValueChange={(value) => setObservationType(value as ObservationType)}
      className="flex flex-wrap gap-4 mt-2"
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
  );
};

export default RadioGroupOptions;
