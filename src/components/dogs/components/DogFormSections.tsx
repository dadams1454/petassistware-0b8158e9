
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { format, addDays, isWithinInterval } from 'date-fns';
import TextInput from '../form/TextInput';
import DatePicker from '../form/DatePicker';
import SelectInput from '../form/SelectInput';
import TextareaInput from '../form/TextareaInput';
import CheckboxInput from '../form/CheckboxInput';
import PhotoUpload from '../form/PhotoUpload';
import WeightInput from '../form/WeightInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { genderOptions, breedOptions } from '../constants/formOptions';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, Syringe, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

  // Calculate next heat date (approximately 6 months after last heat)
  const nextHeatDate = lastHeatDate ? addDays(lastHeatDate, 180) : null;
  
  // Calculate next vaccination date (approximately 1 year after last vaccination)
  const nextVaccinationDate = lastVaccinationDate ? addDays(lastVaccinationDate, 365) : null;

  // Check for scheduling conflict between vaccination and heat cycle
  const hasSchedulingConflict = React.useMemo(() => {
    if (!nextVaccinationDate || !nextHeatDate || isPregnant || gender !== 'Female') return false;
    
    // Check if vaccination is due within 30 days before or after the next heat
    const heatWindow = {
      start: addDays(nextHeatDate, -30),
      end: addDays(nextHeatDate, 30)
    };
    
    return isWithinInterval(nextVaccinationDate, heatWindow);
  }, [nextVaccinationDate, nextHeatDate, isPregnant, gender]);

  // Function to handle litter number input
  const handleLitterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 4) {
      form.setValue('litter_number', value);
    } else {
      form.setValue('litter_number', value < 0 ? 0 : 4);
    }
  };

  // Handle pregnancy status change
  React.useEffect(() => {
    if (!isPregnant) {
      // Reset tie_date when not pregnant
      form.setValue('tie_date', null);
    }
  }, [isPregnant, form]);

  return (
    <Tabs defaultValue="basic">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        {gender === 'Female' && (
          <TabsTrigger value="breeding" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 data-[state=active]:bg-purple-200 dark:data-[state=active]:bg-purple-800">
            Breeding
          </TabsTrigger>
        )}
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="details">Details & Documentation</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            form={form}
            name="name"
            label="Dog Name"
            placeholder="Enter dog's name"
          />
          
          <SelectInput
            form={form}
            name="gender"
            label="Gender"
            options={genderOptions}
            placeholder="Select gender"
          />
          
          <DatePicker
            form={form}
            name="birthdate"
            label="Date of Birth"
          />
          
          <SelectInput
            form={form}
            name="breed"
            label="Breed"
            options={breedOptions}
            placeholder="Select breed"
          />
          
          <SelectInput
            form={form}
            name="color"
            label="Color"
            options={colorOptions}
            placeholder="Select color"
          />
          
          <WeightInput
            form={form}
            name="weight"
            label="Weight (kg)"
          />
        </div>
        
        <PhotoUpload
          form={form}
          name="photo_url"
          label="Dog Photo"
        />
      </TabsContent>
      
      <TabsContent value="health" className="space-y-4 py-4">
        <div className="mt-2">
          <h3 className="text-lg font-medium mb-4">Vaccination Information</h3>
          <Separator className="mb-4" />
          
          <p className="text-sm text-muted-foreground mb-4">
            Add vaccination information after saving the dog profile. Multiple vaccinations can be added in the dog details view.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="breeding" className="space-y-4 py-4">
        {gender === 'Female' && (
          <div className="mt-2">
            <div className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
              <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-300">Breeding Information</h3>
              <Separator className="mb-4 bg-purple-200 dark:bg-purple-700" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <DatePicker
                    form={form}
                    name="last_heat_date"
                    label="Last Heat Date"
                  />
                  {nextHeatDate && !isPregnant && (
                    <div className="flex items-center mt-1 text-xs">
                      <Calendar className="h-3 w-3 mr-1 text-purple-600" />
                      <span className="text-muted-foreground mr-1">Next heat:</span>
                      <Badge variant="outline" className={`font-normal ${hasSchedulingConflict ? "text-amber-600 bg-amber-50" : "text-purple-600 bg-purple-50"}`}>
                        {format(nextHeatDate, 'MMM d, yyyy')}
                      </Badge>
                      
                      {hasSchedulingConflict && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="ml-1.5">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Warning: Heat cycle is predicted within 1 month of next vaccination. Consider rescheduling one of these.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  )}
                </div>
                
                <TextInput
                  form={form}
                  name="litter_number"
                  label="Litter Number (out of 4)"
                  type="number"
                  onChange={handleLitterNumberChange}
                />
                
                <CheckboxInput
                  form={form}
                  name="is_pregnant"
                  label="Currently Pregnant"
                />
                
                {isPregnant && (
                  <div className="space-y-1">
                    <DatePicker
                      form={form}
                      name="tie_date"
                      label="Tie Date"
                    />
                    {form.watch('tie_date') && (
                      <div className="flex items-center mt-1 text-xs">
                        <Calendar className="h-3 w-3 mr-1 text-pink-600" />
                        <span className="text-muted-foreground mr-1">Due date:</span>
                        <Badge variant="outline" className="font-normal text-pink-600 bg-pink-50">
                          {format(addDays(form.watch('tie_date'), 65), 'MMM d, yyyy')}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="details" className="space-y-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            form={form}
            name="microchip_number"
            label="Microchip Number"
            placeholder="Enter microchip number"
          />
          
          <TextInput
            form={form}
            name="registration_number"
            label="Registration Number"
            placeholder="Enter registration number"
          />
          
          <CheckboxInput
            form={form}
            name="pedigree"
            label="Pedigree"
          />
        </div>
        
        <TextareaInput
          form={form}
          name="notes"
          label="Notes"
          placeholder="Enter any additional notes about the dog"
        />
      </TabsContent>
    </Tabs>
  );
};

export default DogFormSections;
