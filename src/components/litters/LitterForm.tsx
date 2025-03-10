
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
import PhotoUpload from '@/components/dogs/form/PhotoUpload';

interface LitterFormData {
  litter_name: string;
  dam_id: string | null;
  sire_id: string | null;
  birth_date: Date;
  expected_go_home_date: Date;
  puppy_count: number | null;
  male_count: number | null;
  female_count: number | null;
  notes: string | null;
  documents_url: string | null;
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
      litter_name: initialData?.litter_name || '',
      dam_id: initialData?.dam_id || null,
      sire_id: initialData?.sire_id || null,
      birth_date: initialData?.birth_date ? new Date(initialData.birth_date) : new Date(),
      expected_go_home_date: initialData?.expected_go_home_date ? new Date(initialData.expected_go_home_date) : new Date(Date.now() + 8 * 7 * 24 * 60 * 60 * 1000), // Default to 8 weeks from now
      puppy_count: initialData?.puppy_count || null,
      male_count: initialData?.male_count || null,
      female_count: initialData?.female_count || null,
      notes: initialData?.notes || null,
      documents_url: initialData?.documents_url || null
    }
  });

  const handleSubmit = async (data: LitterFormData) => {
    setIsSubmitting(true);
    try {
      // Debug logging
      console.log('Submitting form with data:', data);
      
      // Process the data to handle null values
      const processedData = {
        ...data,
        birth_date: data.birth_date.toISOString().split('T')[0],
        expected_go_home_date: data.expected_go_home_date.toISOString().split('T')[0]
      };

      console.log('Processed data for submission:', processedData);

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
            {initialData ? 'Update Litter' : 'Create Litter'}
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default LitterForm;
