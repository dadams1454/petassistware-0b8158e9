
import React from 'react';
import { Textarea, TextareaProps } from './textarea';
import { Label } from './label';
import { cn } from '@/lib/utils';

interface TextareaWithLabelProps extends TextareaProps {
  label: string;
  error?: string;
}

export const TextareaWithLabel: React.FC<TextareaWithLabelProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="space-y-2">
      <Label htmlFor={textareaId}>{label}</Label>
      <Textarea 
        id={textareaId} 
        className={cn(error && "border-red-500", className)} 
        {...props} 
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
