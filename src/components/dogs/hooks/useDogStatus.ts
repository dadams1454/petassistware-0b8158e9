
import { useState, useEffect } from 'react';
import { addDays, differenceInDays, isAfter, isBefore, isWithinInterval } from 'date-fns';

export interface DogStatusData {
  isPregnant: boolean;
  isInHeat: boolean;
  nextVaccinationDue?: string;
  lastHealthCheckup?: string;
  age?: number;
  healthStatus?: string;
  breedingStatus?: string;
  nextHeatDate?: Date;
  estimatedDueDate?: Date;
  hasVaccinationHeatConflict?: boolean;
  
  // Properties needed by various components
  tieDate?: string | null;
  gestationProgressDays?: number | null;
  
  heatCycle: {
    isInHeat: boolean;
    isPreHeat: boolean;
    nextHeatDate?: Date;
    daysUntilNextHeat?: number;
    currentStage?: {
      name: string;
      description: string;
      color?: string; // Added color property
    };
    lastHeatDate?: Date; // Added lastHeatDate
    daysIntoCurrentHeat?: number; // Added daysIntoCurrentHeat
    fertileDays: {
      start?: Date;
      end?: Date;
    };
    recommendedBreedingDays?: { // Added recommendedBreedingDays
      start?: Date;
      end?: Date;
    };
    averageCycleLength?: number; // Added averageCycleLength
  };
}

export const useDogStatus = (dog: any): DogStatusData => {
  const [dogStatus, setDogStatus] = useState<DogStatusData>({
    isPregnant: false,
    isInHeat: false,
    tieDate: null,
    gestationProgressDays: null,
    heatCycle: {
      isInHeat: false,
      isPreHeat: false,
      fertileDays: {},
      lastHeatDate: undefined,
      daysIntoCurrentHeat: 0,
      recommendedBreedingDays: {},
      averageCycleLength: 180
    }
  });

  useEffect(() => {
    if (!dog) return;

    // Determine if dog is pregnant
    const isPregnant = dog.is_pregnant === true;
    
    // Determine heat cycle status
    let isInHeat = false;
    let isPreHeat = false;
    let nextHeatDate: Date | undefined = undefined;
    let currentStage = undefined;
    let fertileDays = {};
    let lastHeatDate: Date | undefined = undefined;
    let daysIntoCurrentHeat = 0;
    let recommendedBreedingDays = {};
    const averageCycleLength = 180; // 6 months in days
    
    if (dog.gender === 'Female' && dog.last_heat_date) {
      lastHeatDate = new Date(dog.last_heat_date);
      const today = new Date();
      
      // Typical heat cycle length is around 180 days (6 months)
      nextHeatDate = addDays(lastHeatDate, averageCycleLength);
      
      // If within 21 days of last heat date, consider the dog in heat
      const heatEndDate = addDays(lastHeatDate, 21);
      isInHeat = isWithinInterval(today, { start: lastHeatDate, end: heatEndDate });
      
      // If within 30 days before next heat, consider in pre-heat
      isPreHeat = !isInHeat && isWithinInterval(today, { 
        start: addDays(nextHeatDate, -30), 
        end: nextHeatDate 
      });
      
      // Calculate days into current heat
      if (isInHeat) {
        daysIntoCurrentHeat = differenceInDays(today, lastHeatDate);
      }
      
      // Determine current stage of heat cycle if in heat
      if (isInHeat) {
        const daysSinceStart = differenceInDays(today, lastHeatDate);
        
        if (daysSinceStart <= 9) {
          currentStage = {
            name: 'Proestrus',
            description: 'Swelling and bloody discharge, not receptive to males',
            color: 'pink-100'
          };
        } else if (daysSinceStart <= 13) {
          currentStage = {
            name: 'Estrus',
            description: 'Fertile period, receptive to males, lighter discharge',
            color: 'red-100'
          };
          
          // Fertile days typically days 9-13 of the cycle
          fertileDays = {
            start: addDays(lastHeatDate, 9),
            end: addDays(lastHeatDate, 13)
          };
          
          // Recommended breeding days (slight overlap with fertile days)
          recommendedBreedingDays = {
            start: addDays(lastHeatDate, 10),
            end: addDays(lastHeatDate, 12)
          };
        } else {
          currentStage = {
            name: 'Diestrus',
            description: 'No longer fertile, discharge diminishing',
            color: 'purple-100'
          };
        }
      }
    }
    
    // Determine next vaccination due date (mock data for now)
    const nextVaccinationDue = dog.next_vaccination_date || undefined;
    
    // Determine last health checkup date (mock data for now)
    const lastHealthCheckup = dog.last_checkup_date || undefined;
    
    // Determine if there's a vaccination/heat conflict
    const hasVaccinationHeatConflict = nextVaccinationDue && nextHeatDate && 
      isWithinInterval(new Date(nextVaccinationDue), {
        start: addDays(nextHeatDate, -14),
        end: addDays(nextHeatDate, 21)
      });
    
    // Mock health status
    const healthStatus = dog.health_status || 'good';
    
    // Mock breeding status
    let breedingStatus = 'not breeding';
    if (isPregnant) {
      breedingStatus = 'pregnant';
    } else if (isInHeat) {
      breedingStatus = 'heat';
    } else if (dog.breeding_status === 'active') {
      breedingStatus = 'breeding';
    } else if (dog.breeding_status === 'resting') {
      breedingStatus = 'resting';
    }
    
    // Get tie date if available
    const tieDate = dog.tie_date || null;
    
    // Calculate gestation progress days if pregnant
    let gestationProgressDays = null;
    if (isPregnant && tieDate) {
      gestationProgressDays = differenceInDays(new Date(), new Date(tieDate));
    }
    
    // Mock estimated due date if pregnant
    const estimatedDueDate = isPregnant && tieDate 
      ? addDays(new Date(tieDate), 63) // 63 days is typical canine gestation
      : undefined;
    
    // Calculate days until next heat
    const daysUntilNextHeat = nextHeatDate 
      ? differenceInDays(nextHeatDate, new Date()) 
      : undefined;
    
    setDogStatus({
      isPregnant,
      isInHeat,
      nextVaccinationDue,
      lastHealthCheckup,
      healthStatus,
      breedingStatus,
      nextHeatDate,
      estimatedDueDate,
      hasVaccinationHeatConflict,
      tieDate,
      gestationProgressDays,
      heatCycle: {
        isInHeat,
        isPreHeat,
        nextHeatDate,
        daysUntilNextHeat,
        currentStage,
        fertileDays,
        lastHeatDate,
        daysIntoCurrentHeat,
        recommendedBreedingDays,
        averageCycleLength
      }
    });
    
  }, [dog]);

  return dogStatus;
};
