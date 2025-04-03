
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './select';
import { Label } from './label';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectWithLabelProps extends React.ComponentPropsWithRef<typeof SelectTrigger> {
  label: string;
  options: SelectOption[] | { value: string; label: string }[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const SelectWithLabel: React.FC<SelectWithLabelProps> = ({
  label,
  options,
  defaultValue,
  value,
  onValueChange,
  error,
  placeholder = "Select an option",
  ...props
}) => {
  const selectId = label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="space-y-2">
      <Label htmlFor={selectId}>{label}</Label>
      <Select 
        defaultValue={defaultValue} 
        value={value} 
        onValueChange={onValueChange}
      >
        <SelectTrigger id={selectId} {...props}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
