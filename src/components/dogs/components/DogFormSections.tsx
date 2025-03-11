
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '../form/TextInput';
import SelectInput from '../form/SelectInput';
import DatePicker from '../form/DatePicker';
import WeightInput from '../form/WeightInput';
import CheckboxInput from '../form/CheckboxInput';
import TextareaInput from '../form/TextareaInput';
import PhotoUpload from '../form/PhotoUpload';
import { breedOptions, genderOptions } from '../constants/formOptions';
import { DogFormValues } from '../schemas/dogFormSchema';

interface DogFormSectionsProps {
  form: UseFormReturn<DogFormValues>;
  watchBreed: string;
  colorOptions: { value: string; label: string }[];
}

const DogFormSections: React.FC<DogFormSectionsProps> = ({
  form,
  watchBreed,
  colorOptions,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput 
          form={form} 
          name="name" 
          label="Name" 
          placeholder="Dog name" 
          required={true} 
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
          name="gender" 
          label="Gender" 
          options={genderOptions} 
          placeholder="Select gender" 
        />
        
        <DatePicker 
          form={form} 
          name="birthdate" 
          label="Birthdate" 
        />
        
        {watchBreed === 'Newfoundland' ? (
          <SelectInput 
            form={form} 
            name="color" 
            label="Color" 
            options={colorOptions} 
            placeholder="Select color" 
          />
        ) : (
          <TextInput 
            form={form} 
            name="color" 
            label="Color" 
            placeholder="Color" 
          />
        )}
        
        <WeightInput 
          form={form} 
          name="weight" 
          label="Weight (kg)" 
        />
        
        <TextInput 
          form={form} 
          name="microchip_number" 
          label="Microchip Number" 
          placeholder="Microchip number" 
        />
        
        <TextInput 
          form={form} 
          name="registration_number" 
          label="Registration Number" 
          placeholder="Registration number" 
        />
        
        <div className="md:col-span-2">
          <PhotoUpload
            form={form}
            name="photo_url"
            label="Dog Photo"
          />
        </div>
        
        <CheckboxInput 
          form={form} 
          name="pedigree" 
          label="Has Pedigree" 
        />
      </div>

      <TextareaInput 
        form={form} 
        name="notes" 
        label="Notes" 
        placeholder="Additional notes about the dog" 
      />
    </>
  );
};

export default DogFormSections;
