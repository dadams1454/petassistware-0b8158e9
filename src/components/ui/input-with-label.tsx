
import React from 'react';
import { Input, InputProps } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';

interface InputWithLabelProps extends InputProps {
  label: string;
  error?: string;
}

export const InputWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Input 
        id={inputId} 
        className={cn(error && "border-red-500", className)} 
        {...props} 
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
