
import React, { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { format, addDays, isWithinInterval } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from './tabs/BasicInfoTab';
import HealthTab from './tabs/HealthTab';
import BreedingTab from './tabs/BreedingTab';
import DetailsTab from './tabs/DetailsTab';
import { DogGender } from '@/types/dog';

interface DogFormSectionsProps {
  form: UseFormReturn<any>;
  watchBreed: string;
  colorOptions: { value: string; label: string; }[];
}

const DogFormSections = ({ form, watchBreed, colorOptions }: DogFormSectionsProps) => {
  // Watch the gender to conditionally show breeding fields
  const gender = form.watch('gender');
  const isPregnant = form.watch('is_pregnant');
  const lastHeatDate = form.watch('last_heat_date');
  const lastVaccinationDate = form.watch('last_vaccination_date');

  // Get the dogId from the form if it exists (for editing) or use a temporary ID for new dogs
  const dogId = form.watch('id') || 'temp-dog-id';

  // Calculate next heat date (approximately 6 months after last heat)
  const nextHeatDate = lastHeatDate ? addDays(lastHeatDate, 180) : null;
  
  // Calculate next vaccination date (approximately 1 year after last vaccination)
  const nextVaccinationDate = lastVaccinationDate ? addDays(lastVaccinationDate, 365) : null;

  // Check for scheduling conflict between vaccination and heat cycle
  const hasSchedulingConflict = useMemo(() => {
    if (!nextVaccinationDate || !nextHeatDate || isPregnant || gender !== DogGender.Female) return false;
    
    // Check if vaccination is due within 30 days before or after the next heat
    const heatWindow = {
      start: addDays(nextHeatDate, -30),
      end: addDays(nextHeatDate, 30)
    };
    
    return isWithinInterval(nextVaccinationDate, heatWindow);
  }, [nextVaccinationDate, nextHeatDate, isPregnant, gender]);

  return (
    <Tabs defaultValue="basic">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        {gender === DogGender.Female && (
          <TabsTrigger value="breeding" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 data-[state=active]:bg-purple-200 dark:data-[state=active]:bg-purple-800">
            Breeding
          </TabsTrigger>
        )}
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="details">Details & Documentation</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <BasicInfoTab form={form} colorOptions={colorOptions} />
      </TabsContent>
      
      <TabsContent value="health">
        <HealthTab dogId={dogId} />
      </TabsContent>
      
      <TabsContent value="breeding">
        {gender === DogGender.Female && (
          <BreedingTab 
            form={form}
            lastHeatDate={lastHeatDate}
            isPregnant={isPregnant}
            nextHeatDate={nextHeatDate}
            hasSchedulingConflict={hasSchedulingConflict}
          />
        )}
      </TabsContent>
      
      <TabsContent value="details">
        <DetailsTab form={form} />
      </TabsContent>
    </Tabs>
  );
};

export default DogFormSections;
