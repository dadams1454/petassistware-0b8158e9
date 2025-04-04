
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WeightUnitWithLegacy, standardizeWeightUnit } from '@/types/common';

interface EnumPreviewCardProps {
  value: string;
  options?: { value: string; label: string; icon?: React.ReactNode }[];
  className?: string;
}

const EnumPreviewCard: React.FC<EnumPreviewCardProps> = ({ 
  value, 
  options = [],
  className
}) => {
  if (!options || options.length === 0) {
    return (
      <Card className={cn("border", className)}>
        <CardContent className="p-3">
          <div className="text-sm font-medium">{value}</div>
        </CardContent>
      </Card>
    );
  }

  // Standardize weight units if value is a weight unit
  let standardizedValue = value;
  try {
    // Only attempt to standardize if it matches a weight unit pattern
    if (['lb', 'kg', 'g', 'oz', 'lbs'].includes(value)) {
      standardizedValue = standardizeWeightUnit(value as WeightUnitWithLegacy);
    }
  } catch (e) {
    // If it can't be standardized, just use the original value
    console.log('Could not standardize value:', value);
  }
  
  // Find the selected option
  const selectedOption = options.find(option => option.value === standardizedValue);
  
  return (
    <Card className={cn("border", className)}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          {selectedOption?.icon}
          <div className="text-sm font-medium">
            {selectedOption?.label || value}
          </div>
          <Check className="h-4 w-4 ml-auto text-primary" />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnumPreviewCard;
