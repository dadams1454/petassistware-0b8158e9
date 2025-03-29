
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { processFormData } from './utils/litterFormUtils';
import { LitterFormData } from './types/litterFormTypes';

/**
 * Hook to handle litter form submission
 */
export const useLitterFormSubmit = (
  initialData: any | undefined, 
  onSuccess: () => void,
  userId: string | undefined
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (data: LitterFormData) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create or update a litter",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Debug logging
      console.log('Submitting form with data:', data);
      
      // Make sure birth_date is not null
      const today = new Date();
      if (!data.birth_date) {
        data.birth_date = today;
      }
      
      // Process the data
      const processedData = processFormData(data, userId, today);
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

  return {
    isSubmitting,
    submitForm
  };
};
