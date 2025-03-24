
import { useMemo } from 'react';
import { addDays, isAfter, isBefore, isToday } from 'date-fns';

export interface DogStatusData {
  isPregnant: boolean;
  inHeatWindow: boolean;
  vaccinationDueSoon: boolean;
  lastHeatDate: Date | null;
  nextHeatDate: Date | null;
  lastVaccinationDate: Date | null;
  nextVaccinationDate: Date | null;
  tieDate?: string | null;
}

export const useDogStatus = (dog: any): DogStatusData => {
  return useMemo(() => {
    // Extract relevant health data
    const isPregnant = dog.is_pregnant || false;
    const lastHeatDate = dog.last_heat_date ? new Date(dog.last_heat_date) : null;
    const lastVaccinationDate = dog.last_vaccination_date ? new Date(dog.last_vaccination_date) : null;
    
    // Calculate next heat date (approximately 6 months after last heat)
    const nextHeatDate = lastHeatDate ? addDays(lastHeatDate, 180) : null;
    
    // Calculate next vaccination date (approximately 1 year after last vaccination)
    const nextVaccinationDate = lastVaccinationDate ? addDays(lastVaccinationDate, 365) : null;
    
    const today = new Date();
    
    // Check if the dog is potentially in heat (2 weeks before to 2 weeks after calculated next heat date)
    const inHeatWindow = nextHeatDate && !isPregnant 
      ? isWithinDays(today, nextHeatDate, 14)
      : false;
    
    // Check if vaccinations are due soon or overdue (within 30 days or past due)
    const vaccinationDueSoon = nextVaccinationDate 
      ? isWithinDays(today, nextVaccinationDate, 30) || isAfter(today, nextVaccinationDate)
      : false;

    return {
      isPregnant,
      inHeatWindow,
      vaccinationDueSoon,
      lastHeatDate,
      nextHeatDate,
      lastVaccinationDate,
      nextVaccinationDate,
      tieDate: dog.tie_date
    };
  }, [
    dog.is_pregnant,
    dog.last_heat_date,
    dog.last_vaccination_date,
    dog.tie_date
  ]);
};

// Helper function to check if a date is within X days of a target date
export function isWithinDays(date: Date, targetDate: Date, days: number): boolean {
  const earliestDate = addDays(targetDate, -days);
  const latestDate = addDays(targetDate, days);
  
  return (
    (isAfter(date, earliestDate) || isToday(earliestDate)) && 
    (isBefore(date, latestDate) || isToday(latestDate))
  );
}
