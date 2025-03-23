
import { useState } from 'react';

/**
 * Hook to manage the current date state
 * This is used for tracking the application's current date
 * which can differ from the system date (e.g., for simulations
 * or when crossing midnight)
 */
export function useCurrentDate() {
  // Current date state (for day changes)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  return {
    currentDate,
    setCurrentDate
  };
}
