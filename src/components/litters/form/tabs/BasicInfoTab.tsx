
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import TextInput from '@/components/dogs/form/TextInput';
import DogSelector from '../DogSelector';
import LitterDatePicker from '../LitterDatePicker';
import { LitterFormData } from '../../hooks/useLitterForm';

interface BasicInfoTabProps {
  form: UseFormReturn<LitterFormData>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput 
          form={form} 
          name="litter_name" 
          label="Friendly Litter Name" 
          placeholder="Enter a descriptive name for this litter (e.g., 'Rainbow Litter')" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput 
            form={form} 
            name="puppy_count" 
            label="Total Puppies" 
            placeholder="Number of puppies"
            disabled={true}
          />
          <div className="grid grid-cols-2 gap-2">
            <TextInput 
              form={form} 
              name="male_count" 
              label="Males" 
              placeholder="Male count" 
            />
            <TextInput 
              form={form} 
              name="female_count" 
              label="Females" 
              placeholder="Female count" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DogSelector 
          form={form} 
          name="dam_id" 
          label="Dam (Mother)" 
          filterGender="Female" 
        />
        
        <DogSelector 
          form={form} 
          name="sire_id" 
          label="Sire (Father)" 
          filterGender="Male" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LitterDatePicker 
          form={form}
          name="birth_date"
          label="Birth Date" 
        />
        
        <LitterDatePicker 
          form={form}
          name="expected_go_home_date"
          label="Expected Go-Home Date" 
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
