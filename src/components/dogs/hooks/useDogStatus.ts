
import { useMemo } from 'react';
import { addDays, differenceInDays, isAfter, isBefore, isToday, format } from 'date-fns';

export interface CycleStage {
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  color: string;
}

export interface HeatCycle {
  lastHeatDate: Date | null;
  nextHeatDate: Date | null;
  currentStage: CycleStage | null;
  daysUntilNextHeat: number | null;
  daysIntoCurrentHeat: number | null;
  isInHeat: boolean;
  isPreHeat: boolean;
  isPostHeat: boolean;
  fertileDays: { start: Date | null; end: Date | null };
  recommendedBreedingDays: { start: Date | null; end: Date | null };
  currentCycleLength: number | null;
  averageCycleLength: number;
  cycleHistory: { date: Date; notes: string }[];
}

export interface DogStatusData {
  isPregnant: boolean;
  heatCycle: HeatCycle;
  vaccinationDueSoon: boolean;
  lastVaccinationDate: Date | null;
  nextVaccinationDate: Date | null;
  tieDate: string | null;
  hasVaccinationHeatConflict: boolean;
  shouldRestrictExercise: boolean;
  gestationProgressDays: number | null;
  estimatedDueDate: Date | null;
}

// Define the stages of the heat cycle
const HEAT_CYCLE_STAGES: CycleStage[] = [
  {
    name: 'Proestrus',
    description: 'Beginning of heat, bleeding starts, males are attracted but female isn\'t receptive yet',
    startDay: 0,
    endDay: 9,
    color: 'pink-200'
  },
  {
    name: 'Estrus', 
    description: 'Fertile period, ovulation occurs, female is receptive to males',
    startDay: 9,
    endDay: 15,
    color: 'red-400'
  },
  {
    name: 'Diestrus',
    description: 'No longer fertile, bleeding subsides, pregnancy may begin',
    startDay: 15,
    endDay: 30,
    color: 'amber-300'
  },
  {
    name: 'Anestrus',
    description: 'Reproductive rest period between cycles',
    startDay: 30,
    endDay: 180,
    color: 'blue-100'
  }
];

// Default cycle length for female dogs (can be breed-specific)
const DEFAULT_CYCLE_LENGTH = 180; // ~6 months in days

export const useDogStatus = (dog: any): DogStatusData => {
  return useMemo(() => {
    // Extract relevant health data
    const isPregnant = dog.is_pregnant || false;
    const lastHeatDate = dog.last_heat_date ? new Date(dog.last_heat_date) : null;
    const lastVaccinationDate = dog.last_vaccination_date ? new Date(dog.last_vaccination_date) : null;
    const tieDate = dog.tie_date ? new Date(dog.tie_date) : null;
    
    // Default to 180 days (6 months) for cycle length if not specified
    const cycleLength = dog.heat_cycle_length || DEFAULT_CYCLE_LENGTH;
    
    const today = new Date();
    
    // Calculate next heat date based on last heat date and cycle length
    const nextHeatDate = lastHeatDate ? addDays(lastHeatDate, cycleLength) : null;
    
    // Calculate next vaccination date (approximately 1 year after last vaccination)
    const nextVaccinationDate = lastVaccinationDate ? addDays(lastVaccinationDate, 365) : null;
    
    // Check if there's a conflict between vaccination and heat cycle
    const hasVaccinationHeatConflict = nextHeatDate && nextVaccinationDate && !isPregnant 
      ? isWithinDays(nextVaccinationDate, nextHeatDate, 30)
      : false;
    
    // Calculate days until next heat
    const daysUntilNextHeat = nextHeatDate ? differenceInDays(nextHeatDate, today) : null;
    
    // Calculate days into current heat if in heat
    const daysIntoCurrentHeat = lastHeatDate && daysUntilNextHeat && daysUntilNextHeat < 0 
      ? Math.abs(differenceInDays(lastHeatDate, today)) % cycleLength
      : null;
    
    // Determine current stage of heat cycle
    const currentStage = determineHeatCycleStage(daysIntoCurrentHeat);
    
    // Determine if dog is in heat (proestrus + estrus periods, typically first 2-3 weeks)
    const isInHeat = currentStage ? 
      (currentStage.name === 'Proestrus' || currentStage.name === 'Estrus') : false;
      
    // Determine if dog is approaching heat (7-14 days before)
    const isPreHeat = !isInHeat && daysUntilNextHeat !== null && daysUntilNextHeat > 0 && daysUntilNextHeat <= 14;
    
    // Determine if dog just finished heat period (up to 14 days after)
    const isPostHeat = currentStage ? currentStage.name === 'Diestrus' : false;
    
    // Calculate fertile window (typically days 9-15 of heat cycle)
    const fertileDays = {
      start: lastHeatDate ? addDays(lastHeatDate, 9) : null,
      end: lastHeatDate ? addDays(lastHeatDate, 15) : null
    };
    
    // Calculate optimal breeding days (typically days 11-13 of heat cycle)
    const recommendedBreedingDays = {
      start: lastHeatDate ? addDays(lastHeatDate, 11) : null,
      end: lastHeatDate ? addDays(lastHeatDate, 13) : null
    };
    
    // Determine if exercise should be restricted (during heat or pregnancy)
    const shouldRestrictExercise = isInHeat || isPregnant;
    
    // Calculate pregnancy progress if applicable
    const gestationProgressDays = isPregnant && tieDate ? differenceInDays(today, tieDate) : null;
    
    // Calculate estimated due date (approximately 63 days after breeding)
    const estimatedDueDate = tieDate ? addDays(tieDate, 63) : null;
    
    // Check if vaccinations are due soon or overdue (within 30 days or past due)
    const vaccinationDueSoon = nextVaccinationDate 
      ? isWithinDays(today, nextVaccinationDate, 30) || isAfter(today, nextVaccinationDate)
      : false;

    // Build heat cycle information object
    const heatCycle: HeatCycle = {
      lastHeatDate,
      nextHeatDate,
      currentStage,
      daysUntilNextHeat,
      daysIntoCurrentHeat,
      isInHeat,
      isPreHeat,
      isPostHeat,
      fertileDays,
      recommendedBreedingDays,
      currentCycleLength: lastHeatDate ? differenceInDays(today, lastHeatDate) : null,
      averageCycleLength: cycleLength,
      cycleHistory: [] // In a real app, this would come from a historical record
    };

    return {
      isPregnant,
      heatCycle,
      vaccinationDueSoon,
      lastVaccinationDate,
      nextVaccinationDate,
      tieDate: dog.tie_date,
      hasVaccinationHeatConflict,
      shouldRestrictExercise,
      gestationProgressDays,
      estimatedDueDate
    };
  }, [
    dog.is_pregnant,
    dog.last_heat_date,
    dog.last_vaccination_date,
    dog.tie_date,
    dog.heat_cycle_length
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

// Helper function to determine the current stage of the heat cycle
function determineHeatCycleStage(daysIntoHeat: number | null): CycleStage | null {
  if (daysIntoHeat === null) return null;
  
  return HEAT_CYCLE_STAGES.find(stage => 
    daysIntoHeat >= stage.startDay && daysIntoHeat < stage.endDay
  ) || null;
}
