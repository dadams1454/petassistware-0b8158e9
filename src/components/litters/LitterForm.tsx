
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import TextInput from '@/components/dogs/form/TextInput';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import { CustomButton } from '@/components/ui/custom-button';
import DogSelector from './form/DogSelector';
import LitterDatePicker from './form/LitterDatePicker';

interface LitterFormData {
  dam_id: string | null;
  sire_id: string | null;
  birth_date: Date;
  puppy_count: number | null;
  notes: string | null;
}

interface LitterFormProps {
  initialData?: Litter;
  onSuccess: () => void;
}

const LitterForm: React.FC<LitterFormProps> = ({ initialData, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LitterFormData>({
    defaultValues: {
      dam_id: initialData?.dam_id || null,
      sire_id: initialData?.sire_id || null,
      birth_date: initialData?.birth_date ? new Date(initialData.birth_date) : new Date(),
      puppy_count: initialData?.puppy_count || null,
      notes: initialData?.notes || null
    }
  });

  const handleSubmit = async (data: LitterFormData) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        birth_date: data.birth_date.toISOString().split('T')[0]
      };

      if (initialData) {
        // Update existing litter
        const { error } = await supabase
          .from('litters')
          .update(formattedData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        // Create new litter
        const { error } = await supabase
          .from('litters')
          .insert(formattedData);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving litter:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DogSelector 
            form={form} 
            name="dam_id" 
            label="Dam (Mother)" 
            filterGender="female" 
          />
          
          <DogSelector 
            form={form} 
            name="sire_id" 
            label="Sire (Father)" 
            filterGender="male" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LitterDatePicker form={form} />
          
          <TextInput 
            form={form} 
            name="puppy_count" 
            label="Puppy Count" 
            placeholder="Enter number of puppies" 
          />
        </div>

        <TextareaInput 
          form={form} 
          name="notes" 
          label="Notes" 
          placeholder="Enter any notes about this litter" 
        />

        <div className="flex justify-end space-x-2 pt-4">
          <CustomButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            fullWidth={false}
          >
            {initialData ? 'Update Litter' : 'Create Litter'}
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default LitterForm;
