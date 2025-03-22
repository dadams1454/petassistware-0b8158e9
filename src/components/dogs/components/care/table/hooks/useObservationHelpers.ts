
import { useCallback } from 'react';

export const useObservationHelpers = () => {
  // Extract the time from an observation if available
  const getObservationTimeSlot = useCallback((observationDetails: { timeSlot?: string } | null) => {
    if (!observationDetails || !observationDetails.timeSlot) return null;
    return observationDetails.timeSlot;
  }, []);

  return {
    getObservationTimeSlot
  };
};
