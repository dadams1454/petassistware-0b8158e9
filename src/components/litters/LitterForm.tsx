
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import LitterBasicInfo from './form/LitterBasicInfo';
import LitterParents from './form/LitterParents';
import LitterDates from './form/LitterDates';
import LitterAdditionalInfo from './form/LitterAdditionalInfo';
import FormActions from './form/FormActions';

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
        <LitterBasicInfo form={form} />
        <LitterParents form={form} />
        <LitterDates form={form} />
        <LitterAdditionalInfo form={form} />
        <FormActions 
          isSubmitting={isSubmitting} 
          onCancel={onCancel} 
          isEdit={!!initialData} 
        />
      </form>
    </Form>
  );
};

export default LitterForm;
