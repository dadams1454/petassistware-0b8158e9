
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/custom-button';
import { supabase } from '@/integrations/supabase/client';
import TextInput from '@/components/dogs/form/TextInput';
import SelectInput from '@/components/dogs/form/SelectInput';

interface PuppyFormData {
  name: string | null;
  gender: string | null;
  status: string;
  microchip_number: string | null;
  sale_price: number | null;
}

interface PuppyFormProps {
  litterId: string;
  initialData?: Puppy;
  onSuccess: () => void;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const statusOptions = [
  { value: 'Available', label: 'Available' },
  { value: 'Reserved', label: 'Reserved' },
  { value: 'Sold', label: 'Sold' },
  { value: 'Retained', label: 'Retained' },
  { value: 'Deceased', label: 'Deceased' },
];

const PuppyForm: React.FC<PuppyFormProps> = ({ 
  litterId, 
  initialData, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PuppyFormData>({
    defaultValues: {
      name: initialData?.name || null,
      gender: initialData?.gender || null,
      status: initialData?.status || 'Available',
      microchip_number: initialData?.microchip_number || null,
      sale_price: initialData?.sale_price || null,
    }
  });

  const handleSubmit = async (data: PuppyFormData) => {
    setIsSubmitting(true);
    try {
      const puppyData = {
        ...data,
        litter_id: litterId,
      };

      if (initialData) {
        // Update existing puppy
        const { error } = await supabase
          .from('puppies')
          .update(puppyData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        // Create new puppy
        const { error } = await supabase
          .from('puppies')
          .insert(puppyData);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving puppy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
            label="Gender" 
            options={genderOptions} 
            placeholder="Select gender" 
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

        <div className="flex justify-end space-x-2 pt-4">
          <CustomButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            fullWidth={false}
          >
            {initialData ? 'Update Puppy' : 'Add Puppy'}
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default PuppyForm;
