
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { weightUnitInfos, WeightUnit } from '@/types';
import { Label } from '@/components/ui/label';

interface WeightUnitSelectProps {
  value: WeightUnit;
  onChange: (value: WeightUnit) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

/**
 * Reusable component for selecting weight units
 */
const WeightUnitSelect: React.FC<WeightUnitSelectProps> = ({
  value,
  onChange,
  disabled = false,
  label,
  className,
}) => {
  const handleChange = (newValue: string) => {
    onChange(newValue as WeightUnit);
  };

  return (
    <div className={className}>
      {label && <Label className="mb-2">{label}</Label>}
      <Select
        value={value}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select unit" />
        </SelectTrigger>
        <SelectContent>
          {weightUnitInfos.map((unit) => (
            <SelectItem key={unit.value} value={unit.value}>
              {unit.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WeightUnitSelect;
