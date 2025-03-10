
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Form } from '@/components/ui/form';
import { CustomButton } from '@/components/ui/custom-button';
import TextInput from '@/components/dogs/form/TextInput';
import SelectInput from '@/components/dogs/form/SelectInput';
import WeightInput from '@/components/dogs/form/WeightInput';
import TextareaInput from '@/components/dogs/form/TextareaInput';

interface WelpingPuppyFormProps {
  litterId: string;
  onSuccess: () => Promise<void>;
}

interface WelpingPuppyFormData {
  name: string;
  gender: string;
  color: string;
  birth_weight: string;
  notes: string;
}

const WelpingPuppyForm: React.FC<WelpingPuppyFormProps> = ({ 
  litterId,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<WelpingPuppyFormData>({
    defaultValues: {
      name: '',
      gender: '',
      color: '',
      birth_weight: '',
      notes: ''
    }
  });

  const handleSubmit = async (data: WelpingPuppyFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare data for database
      const puppyData = {
        name: data.name || null,
        gender: data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase() : null,
        color: data.color || null,
        birth_weight: data.birth_weight || null,
        notes: data.notes || null,
        birth_date: new Date().toISOString().split('T')[0], // Today's date
        status: 'Available', // Default status
        litter_id: litterId
      };

      // Insert the puppy record
      const { error } = await supabase
        .from('puppies')
        .insert(puppyData);

      if (error) throw error;
      
      await onSuccess();
    } catch (error) {
      console.error('Error recording puppy:', error);
      toast({
        title: "Error",
        description: "There was a problem recording the puppy. Please try again.",
        variant: "destructive",
      });
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
          <TextInput
            form={form}
            name="color"
            label="Color/Markings"
            placeholder="e.g., Black & White, Brindle, etc."
          />
          
          <WeightInput
            form={form}
            name="birth_weight"
            label="Birth Weight (oz)"
          />
        </div>
        
        <TextareaInput
          form={form}
          name="notes"
          label="Birth Notes"
          placeholder="Any observations during birth, assistance needed, etc."
        />

        <div className="flex justify-end pt-4">
          <CustomButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            fullWidth={false}
          >
            Record Puppy
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default WelpingPuppyForm;
