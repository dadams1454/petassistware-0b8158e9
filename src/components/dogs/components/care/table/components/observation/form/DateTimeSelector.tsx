
import React, { memo } from 'react';
import { format } from 'date-fns';

interface DateTimeSelectorProps {
  observationDate: Date;
  setObservationDate: (date: Date) => void;
}

// This component now just serves as a hidden date setter
// We don't display the date in the UI as it's redundant
const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  observationDate,
  setObservationDate
}) => {
  // Component no longer displays anything, just maintains the date state
  return null;
};

// Memoize the component to prevent unnecessary re-renders
export default memo(DateTimeSelector);
