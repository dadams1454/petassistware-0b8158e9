
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import SelectInput from '@/components/dogs/form/SelectInput';
import DatePicker from '@/components/dogs/form/DatePicker';
import PhotoUpload from '@/components/dogs/form/PhotoUpload';
import { genderOptions, statusOptions } from './constants';
import { PuppyFormData } from './types';

interface BasicInfoTabProps {
  form: UseFormReturn<PuppyFormData>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput 
          form={form} 
          name="name" 
          label="Name" 
          placeholder="Puppy name (optional)" 
        />
        
        <SelectInput 
          form={form} 
          name="gender" 
          label="Sex" 
          options={genderOptions} 
          placeholder="Select gender" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePicker
          form={form}
          name="birth_date"
          label="Birth Date"
        />
        
        <TextInput 
          form={form} 
          name="color" 
          label="Color" 
          placeholder="Puppy's color markings" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput 
          form={form} 
          name="status" 
          label="Status" 
          options={statusOptions} 
        />
        
        <TextInput 
          form={form} 
          name="microchip_number" 
          label="Microchip Number" 
          placeholder="Enter microchip number" 
        />
      </div>

      <TextInput 
        form={form} 
        name="sale_price" 
        label="Sale Price" 
        placeholder="Enter sale price" 
      />

      <PhotoUpload
        form={form}
        name="photo_url"
        label="Puppy Photo"
      />
    </div>
  );
};

export default BasicInfoTab;
