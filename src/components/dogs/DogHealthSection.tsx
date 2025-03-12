
import React from 'react';
import { addDays } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useDogHealthVaccinations } from './hooks/useDogHealthVaccinations';
import VaccinationHistorySection from './components/VaccinationHistorySection';
import BreedingInfoSection from './components/BreedingInfoSection';
import VaccinationManager from './components/VaccinationManager';

interface DogHealthSectionProps {
  dog: any;
}

const DogHealthSection: React.FC<DogHealthSectionProps> = ({ dog }) => {
  // Use our custom hook to fetch and manage vaccination data
  const { 
    latestVaccinations, 
    isLoading 
  } = useDogHealthVaccinations(dog.id);

  // Extract relevant health data from the dog object
  const lastHeatDate = dog.last_heat_date ? new Date(dog.last_heat_date) : null;
  const isPregnant = dog.is_pregnant || false;
  const tieDate = dog.tie_date ? new Date(dog.tie_date) : null;
  const litterNumber = dog.litter_number || 0;

  // Calculate next heat date (approximately 6 months after last heat)
  const nextHeatDate = lastHeatDate ? addDays(lastHeatDate, 180) : null;
  
  // Check if any upcoming vaccinations conflict with heat cycle
  const hasVaccinationConflict = nextHeatDate && !isPregnant && dog.gender === 'Female' && 
    latestVaccinations.some(vax => {
      const nextVaxDate = addDays(vax.date, 365);
      const heatWindow = {
        start: addDays(nextHeatDate, -30),
        end: addDays(nextHeatDate, 30)
      };
      return nextVaxDate >= heatWindow.start && nextVaxDate <= heatWindow.end;
    });

  return (
    <div className="text-sm space-y-4">
      {/* Only show breeding section for females first and more prominently */}
      {dog.gender === 'Female' && (
        <>
          <div className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-base text-purple-800 dark:text-purple-300">Breeding Information</h4>
              {isPregnant && (
                <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
                  Pregnant
                </span>
              )}
            </div>
            
            <BreedingInfoSection 
              lastHeatDate={lastHeatDate}
              isPregnant={isPregnant}
              tieDate={tieDate}
              litterNumber={litterNumber}
              nextHeatDate={nextHeatDate}
              hasVaccinationConflict={hasVaccinationConflict}
            />
          </div>
          
          <Separator className="my-2" />
        </>
      )}

      {/* Vaccination management */}
      <div className="space-y-2">
        <VaccinationManager dogId={dog.id} />
      </div>

      <Separator className="my-2" />

      {/* Vaccination information */}
      <div className="space-y-2 opacity-90">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm text-muted-foreground">Vaccination Schedule</h4>
        </div>
        
        <VaccinationHistorySection 
          vaccinations={latestVaccinations}
          isLoading={isLoading}
          nextHeatDate={nextHeatDate}
          isPregnant={isPregnant}
          dogGender={dog.gender}
        />
      </div>
    </div>
  );
};

export default DogHealthSection;
