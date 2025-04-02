
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPottyBreaksByDogAndTimeSlot } from '@/services/dailyCare/pottyBreak/queries/timeSlotQueries';

// Fixing function by adding a dummy date parameter
export const usePottyBreakData = (dogId: string, timeSlot: string, date = new Date()) => {
  const [pottyBreakData, setPottyBreakData] = useState<Record<string, string[]>>({});

  const { data: pottyBreaks, isLoading } = useQuery({
    queryKey: ['pottyBreaks', dogId, timeSlot, date],
    queryFn: async () => {
      const data = await getPottyBreaksByDogAndTimeSlot(dogId, timeSlot);
      return data;
    },
    enabled: !!dogId && !!timeSlot
  });

  useEffect(() => {
    if (pottyBreaks) {
      // Initialize an empty record if we get an array
      const formattedData: Record<string, string[]> = {};
      
      // Add the data to the record
      if (Array.isArray(pottyBreaks)) {
        pottyBreaks.forEach(pottyBreak => {
          const key = pottyBreak.id;
          formattedData[key] = [
            pottyBreak.session_time,
            pottyBreak.notes,
            pottyBreak.created_at
          ];
        });
      }
      
      setPottyBreakData(formattedData);
    }
  }, [pottyBreaks]);

  return { pottyBreakData, isLoading };
};
