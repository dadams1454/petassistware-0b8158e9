
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import SelectInput from '@/components/dogs/form/SelectInput';
import WeightInput from '@/components/dogs/form/WeightInput';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import { WelpingPuppyFormData } from '../hooks/useWelpingPuppyForm';
import { colorOptions } from '@/components/litters/puppies/constants';
import BirthTimeInput from '../components/BirthTimeInput';

interface BasicInfoTabProps {
  form: UseFormReturn<WelpingPuppyFormData>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          form={form}
          name="name"
          label="Temporary Name/ID"
          placeholder="e.g., Green collar, Puppy #1, etc."
        />
        
        <SelectInput
          form={form}
          name="gender"
          label="Gender"
          placeholder="Select gender"
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' }
          ]}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          form={form}
          name="color"
          label="Color"
          placeholder="Select color"
          options={colorOptions}
        />
        
        <TextInput
          form={form}
          name="markings"
          label="Markings"
          placeholder="e.g., White chest patch, etc."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeightInput
          form={form}
          name="birth_weight"
          label="Birth Weight (oz)"
        />
        
        <BirthTimeInput form={form} />
      </div>
      
      <TextareaInput
        form={form}
        name="notes"
        label="Birth Notes"
        placeholder="Any observations during birth, assistance needed, etc."
      />
    </>
  );
};

export default BasicInfoTab;
