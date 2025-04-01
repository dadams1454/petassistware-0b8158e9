
import { useMemo } from 'react';
import { format, addDays, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';

export const useDogStatus = (dog: any) => {
  const isPregnant = useMemo(() => {
    // Check if dog is pregnant based on the is_pregnant flag
    return dog?.is_pregnant === true;
  }, [dog?.is_pregnant]);
  
  const tieDate = useMemo(() => {
    // Return the tie date if it exists
    return dog?.tie_date || null;
  }, [dog?.tie_date]);
  
  const lastHeatDate = useMemo(() => {
    // Parse last heat date from string to Date object
    return dog?.last_heat_date ? parseISO(dog.last_heat_date) : null;
  }, [dog?.last_heat_date]);
  
  const estimatedDueDate = useMemo(() => {
    // Calculate due date (63 days from tie date)
    if (isPregnant && tieDate) {
      return addDays(parseISO(tieDate), 63);
    }
    return null;
  }, [isPregnant, tieDate]);
  
  const gestationProgressDays = useMemo(() => {
    // Calculate days since tie date
    if (isPregnant && tieDate) {
      return differenceInDays(new Date(), parseISO(tieDate));
    }
    return null;
  }, [isPregnant, tieDate]);
  
  // Heat cycle calculations
  const nextHeatDate = useMemo(() => {
    if (lastHeatDate) {
      // Average dog heat cycle is ~6 months
      return addDays(lastHeatDate, 180);
    }
    return null;
  }, [lastHeatDate]);
  
  const daysUntilNextHeat = useMemo(() => {
    if (nextHeatDate) {
      return differenceInDays(nextHeatDate, new Date());
    }
    return null;
  }, [nextHeatDate]);
  
  const isInHeat = useMemo(() => {
    if (isPregnant) return false; // Cannot be in heat if pregnant
    
    if (lastHeatDate) {
      // Typically heat lasts 2-3 weeks, we'll use 21 days
      const heatEndDate = addDays(lastHeatDate, 21);
      return isBefore(new Date(), heatEndDate);
    }
    
    // If we have a next heat date and it's in the past, but within 21 days
    if (nextHeatDate && isBefore(nextHeatDate, new Date())) {
      const daysSinceNextHeat = differenceInDays(new Date(), nextHeatDate);
      return daysSinceNextHeat <= 21;
    }
    
    return false;
  }, [isPregnant, lastHeatDate, nextHeatDate]);
  
  const isPreHeat = useMemo(() => {
    if (isPregnant || isInHeat) return false;
    
    if (nextHeatDate) {
      // Consider "pre-heat" to be 2 weeks before next heat
      const preHeatStart = addDays(nextHeatDate, -14);
      return isAfter(new Date(), preHeatStart) && isBefore(new Date(), nextHeatDate);
    }
    
    return false;
  }, [isPregnant, isInHeat, nextHeatDate]);
  
  const currentStage = useMemo(() => {
    if (!isInHeat) return null;
    
    let dayOfHeat: number;
    
    if (lastHeatDate && isBefore(lastHeatDate, new Date())) {
      // Calculate days since heat started
      dayOfHeat = differenceInDays(new Date(), lastHeatDate) + 1;
    } else if (nextHeatDate && isBefore(nextHeatDate, new Date())) {
      // Calculate days since estimated heat started
      dayOfHeat = differenceInDays(new Date(), nextHeatDate) + 1;
    } else {
      return null;
    }
    
    // Determine stage based on typical canine estrous cycle
    if (dayOfHeat <= 9) {
      return {
        name: 'Proestrus',
        description: 'Initial stage with bleeding, swelling, male attraction but female not receptive',
        day: dayOfHeat
      };
    } else if (dayOfHeat <= 15) {
      return {
        name: 'Estrus',
        description: 'Fertile period when female is receptive to breeding',
        day: dayOfHeat
      };
    } else if (dayOfHeat <= 21) {
      return {
        name: 'Diestrus',
        description: 'Post-ovulation phase when female is no longer receptive',
        day: dayOfHeat
      };
    } else {
      return {
        name: 'Anestrus',
        description: 'Resting phase between heat cycles',
        day: dayOfHeat
      };
    }
  }, [isInHeat, lastHeatDate, nextHeatDate]);
  
  const fertileDays = useMemo(() => {
    if (!isInHeat || !currentStage) return null;
    
    // Fertile window is typically during estrus (days 9-15 of heat)
    if (lastHeatDate) {
      return {
        start: addDays(lastHeatDate, 9),
        end: addDays(lastHeatDate, 15)
      };
    } else if (nextHeatDate && isBefore(nextHeatDate, new Date())) {
      return {
        start: addDays(nextHeatDate, 9),
        end: addDays(nextHeatDate, 15)
      };
    }
    
    return null;
  }, [isInHeat, currentStage, lastHeatDate, nextHeatDate]);
  
  // Group all heat cycle related info
  const heatCycle = {
    isInHeat,
    isPreHeat,
    lastHeatDate,
    nextHeatDate,
    daysUntilNextHeat,
    currentStage,
    fertileDays
  };
  
  return {
    isPregnant,
    tieDate,
    estimatedDueDate,
    gestationProgressDays,
    heatCycle
  };
};
