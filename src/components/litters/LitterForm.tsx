
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import TextInput from '@/components/dogs/form/TextInput';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import { CustomButton } from '@/components/ui/custom-button';
import DogSelector from './form/DogSelector';
import LitterDatePicker from './form/LitterDatePicker';
import { toast } from '@/components/ui/use-toast';

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
  onCancel?: () => void;
}

const LitterForm: React.FC<LitterFormProps> = ({ initialData, onSuccess, onCancel }) => {
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
      // Process the data to handle "none" values
      const processedData = {
        ...data,
        dam_id: data.dam_id === "none" ? null : data.dam_id,
        sire_id: data.sire_id === "none" ? null : data.sire_id,
        birth_date: data.birth_date.toISOString().split('T')[0]
      };

      if (initialData) {
        // Update existing litter
        const { error } = await supabase
          .from('litters')
          .update(processedData)
          .eq('id', initialData.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Litter updated successfully",
        });
      } else {
        // Create new litter
        const { error } = await supabase
          .from('litters')
          .insert(processedData);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Litter created successfully",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving litter:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the litter",
        variant: "destructive",
      });
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
            {initialData ? 'Update Litter' : 'Create Litter'}
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default LitterForm;
