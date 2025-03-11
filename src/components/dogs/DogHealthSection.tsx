
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
      {/* Vaccination management */}
      <div className="space-y-2">
        <VaccinationManager dogId={dog.id} />
      </div>

      <Separator className="my-2" />

      {/* Vaccination information */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-sm">Vaccination Schedule</h4>
        </div>
        
        <VaccinationHistorySection 
          vaccinations={latestVaccinations}
          isLoading={isLoading}
          nextHeatDate={nextHeatDate}
          isPregnant={isPregnant}
          dogGender={dog.gender}
        />
      </div>

      {/* Only show breeding section for females */}
      {dog.gender === 'Female' && (
        <>
          <Separator className="my-2" />
          
          <BreedingInfoSection 
            lastHeatDate={lastHeatDate}
            isPregnant={isPregnant}
            tieDate={tieDate}
            litterNumber={litterNumber}
            nextHeatDate={nextHeatDate}
            hasVaccinationConflict={hasVaccinationConflict}
          />
        </>
      )}
    </div>
  );
};

export default DogHealthSection;
