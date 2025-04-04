
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
  // Handler to ensure proper selection
  const handleTypeSelection = (type: ObservationType) => {
    setObservationType(type);
  };

  return (
    <div>
      <Label htmlFor="observation-type" className="mb-2 block">Observation Type</Label>
      <RadioGroup 
        value={observationType} 
        onValueChange={handleTypeSelection}
        className="flex flex-wrap gap-4 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="accident" id="accident-radio" />
          <Label 
            htmlFor="accident-radio" 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handleTypeSelection('accident')}
          >
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Accident
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="heat" id="heat-radio" />
          <Label 
            htmlFor="heat-radio" 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handleTypeSelection('heat')}
          >
            <Heart className="h-4 w-4 text-red-500" />
            Heat Signs
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="behavior" id="behavior-radio" />
          <Label 
            htmlFor="behavior-radio" 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handleTypeSelection('behavior')}
          >
            <Activity className="h-4 w-4 text-blue-500" />
            Behavior
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="other" id="other-radio" />
          <Label 
            htmlFor="other-radio" 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => handleTypeSelection('other')}
          >
            <MessageCircle className="h-4 w-4 text-gray-500" />
            Other
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RadioGroupOptions;
