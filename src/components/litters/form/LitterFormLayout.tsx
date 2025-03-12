
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/custom-button';
import TextInput from '@/components/dogs/form/TextInput';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import DogSelector from './DogSelector';
import LitterDatePicker from './LitterDatePicker';
import PhotoUpload from '@/components/dogs/form/PhotoUpload';
import { UseFormReturn } from 'react-hook-form';
import { LitterFormData } from '../hooks/useLitterForm';

interface LitterFormLayoutProps {
  form: UseFormReturn<LitterFormData>;
  isSubmitting: boolean;
  onSubmit: (data: LitterFormData) => void;
  onCancel?: () => void;
  isEditMode: boolean;
}

const LitterFormLayout: React.FC<LitterFormLayoutProps> = ({
  form,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditMode
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput 
            form={form} 
            name="litter_name" 
            label="Litter Name/ID" 
            placeholder="Enter a name or ID for this litter" 
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

        <TextareaInput 
          form={form} 
          name="notes" 
          label="Notes" 
          placeholder="Enter any notes about this litter" 
        />

        <PhotoUpload 
          form={form} 
          name="documents_url" 
          label="Litter Documents (Health records, pedigrees, etc.)" 
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <CustomButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            fullWidth={false}
          >
            {isEditMode ? 'Update Litter' : 'Create Litter'}
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default LitterFormLayout;
