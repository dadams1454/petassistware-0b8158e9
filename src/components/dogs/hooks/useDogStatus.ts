
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
  heatCycle: {
    isInHeat: boolean;
    isPreHeat: boolean;
    nextHeatDate?: Date;
    daysUntilNextHeat?: number;
    currentStage?: {
      name: string;
      description: string;
    };
    fertileDays: {
      start?: Date;
      end?: Date;
    };
  };
}

export const useDogStatus = (dog: any): DogStatusData => {
  const [dogStatus, setDogStatus] = useState<DogStatusData>({
    isPregnant: false,
    isInHeat: false,
    heatCycle: {
      isInHeat: false,
      isPreHeat: false,
      fertileDays: {}
    }
  });

  useEffect(() => {
    if (!dog) return;

    // Determine if dog is pregnant
    const isPregnant = dog.breeding_status === 'pregnant';
    
    // Determine heat cycle status
    let isInHeat = false;
    let isPreHeat = false;
    let nextHeatDate: Date | undefined = undefined;
    let currentStage = undefined;
    let fertileDays = {};
    
    if (dog.gender === 'Female' && dog.last_heat_date) {
      const lastHeatDate = new Date(dog.last_heat_date);
      const today = new Date();
      
      // Typical heat cycle length is around 180 days (6 months)
      nextHeatDate = addDays(lastHeatDate, 180);
      
      // If within 21 days of last heat date, consider the dog in heat
      const heatEndDate = addDays(lastHeatDate, 21);
      isInHeat = isWithinInterval(today, { start: lastHeatDate, end: heatEndDate });
      
      // If within 30 days before next heat, consider in pre-heat
      isPreHeat = !isInHeat && isWithinInterval(today, { 
        start: addDays(nextHeatDate, -30), 
        end: nextHeatDate 
      });
      
      // Determine current stage of heat cycle if in heat
      if (isInHeat) {
        const daysSinceStart = differenceInDays(today, lastHeatDate);
        
        if (daysSinceStart <= 9) {
          currentStage = {
            name: 'Proestrus',
            description: 'Swelling and bloody discharge, not receptive to males'
          };
        } else if (daysSinceStart <= 13) {
          currentStage = {
            name: 'Estrus',
            description: 'Fertile period, receptive to males, lighter discharge'
          };
          
          // Fertile days typically days 9-13 of the cycle
          fertileDays = {
            start: addDays(lastHeatDate, 9),
            end: addDays(lastHeatDate, 13)
          };
        } else {
          currentStage = {
            name: 'Diestrus',
            description: 'No longer fertile, discharge diminishing'
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
    
    // Mock estimated due date if pregnant
    const estimatedDueDate = isPregnant && dog.breeding_date 
      ? addDays(new Date(dog.breeding_date), 63) // 63 days is typical canine gestation
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
      heatCycle: {
        isInHeat,
        isPreHeat,
        nextHeatDate,
        daysUntilNextHeat,
        currentStage,
        fertileDays
      }
    });
    
  }, [dog]);

  return dogStatus;
};
