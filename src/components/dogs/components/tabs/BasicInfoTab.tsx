
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '../../form/TextInput';
import DatePicker from '../../form/DatePicker';
import SelectInput from '../../form/SelectInput';
import WeightInput from '../../form/WeightInput';
import PhotoUpload from '../../form/PhotoUpload';
import { genderOptions, breedOptions } from '../../constants/formOptions';

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
  colorOptions: { value: string; label: string; }[];
}

const BasicInfoTab = ({ form, colorOptions }: BasicInfoTabProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          form={form}
          name="name"
          label="Dog Name"
          placeholder="Enter dog's name"
          required={true}
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
          required={true}
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
          label="Weight"
        />
      </div>
      
      <PhotoUpload
        form={form}
        name="photo_url"
        label="Dog Photo"
      />
    </div>
  );
};

export default BasicInfoTab;
