
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { format, addDays } from 'date-fns';
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
import { Calendar } from 'lucide-react';

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

  // Calculate next heat date (approximately 6 months after last heat)
  const nextHeatDate = lastHeatDate ? addDays(lastHeatDate, 180) : null;

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
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
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

        {/* Breeding fields for female dogs */}
        {gender === 'Female' && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Breeding Information</h3>
            <Separator className="mb-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <DatePicker
                  form={form}
                  name="last_heat_date"
                  label="Last Heat Date"
                />
                {nextHeatDate && !isPregnant && (
                  <div className="flex items-center mt-1 text-xs">
                    <Calendar className="h-3 w-3 mr-1 text-blue-600" />
                    <span className="text-muted-foreground mr-1">Next heat:</span>
                    <Badge variant="outline" className="font-normal text-blue-600 bg-blue-50">
                      {format(nextHeatDate, 'MMM d, yyyy')}
                    </Badge>
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
