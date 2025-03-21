
import React, { createContext, useContext, useMemo } from 'react';
import { generateTimeSlots } from '../dogGroupColors';

interface TimeManagerContextType {
  currentHour: number;
  timeSlots: string[];
}

const TimeManagerContext = createContext<TimeManagerContextType>({
  currentHour: new Date().getHours(),
  timeSlots: []
});

interface TimeManagerProviderProps {
  children: React.ReactNode;
  activeCategory: string;
}

/**
 * Provides time-related data for the care table
 */
export const TimeManagerProvider: React.FC<TimeManagerProviderProps> = ({ 
  children,
  activeCategory
}) => {
  // Current hour (0-23) for highlighting the current time slot
  const currentHour = useMemo(() => new Date().getHours(), []);
  
  // Generate time slots based on category and current time
  const timeSlots = useMemo(() => 
    generateTimeSlots(new Date(), activeCategory), 
    [activeCategory]
  );
  
  return (
    <TimeManagerContext.Provider value={{ currentHour, timeSlots }}>
      {children}
    </TimeManagerContext.Provider>
  );
};

/**
 * Hook to access time manager context
 */
export const useTimeManager = () => {
  const context = useContext(TimeManagerContext);
  if (!context) {
    throw new Error('useTimeManager must be used within a TimeManagerProvider');
  }
  return context;
};
