
import React, { memo } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateTimeSelectorProps {
  observationDate: Date;
  setObservationDate: (date: Date) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  observationDate,
  setObservationDate
}) => {
  return (
    <div>
      <Label htmlFor="observation-date">Date</Label>
      <Button
        id="observation-date"
        variant="outline"
        type="button"
        className={cn(
          "w-full justify-start text-left font-normal bg-background cursor-default mt-1"
        )}
        disabled
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {format(observationDate, 'MMMM d, yyyy')}
      </Button>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(DateTimeSelector);
