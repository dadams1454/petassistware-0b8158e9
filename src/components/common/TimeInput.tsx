
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';

interface TimeInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  addButtonLabel?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ 
  values, 
  onChange, 
  addButtonLabel = "Add Time" 
}) => {
  const handleTimeChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const handleAddTime = () => {
    onChange([...values, '12:00']);
  };

  const handleRemoveTime = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      {values.map((time, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(index, e.target.value)}
            className="flex-1"
          />
          {values.length > 1 && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => handleRemoveTime(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddTime}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-1" />
        {addButtonLabel}
      </Button>
    </div>
  );
};

export default TimeInput;
