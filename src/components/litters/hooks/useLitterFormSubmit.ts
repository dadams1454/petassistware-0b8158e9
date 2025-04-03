
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { LitterFormData } from './types/litterFormTypes';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';

/**
 * Hook to handle litter form submission
 */
export const useLitterFormSubmit = (
  initialData: any, 
  onSuccess: () => void,
  userId?: string
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitForm = async (formData: LitterFormData) => {
    setIsSubmitting(true);
    
    try {
      // Format dates for database
      const birthDate = formatDateToYYYYMMDD(formData.birth_date);
      const expectedGoHomeDate = formData.expected_go_home_date 
        ? formatDateToYYYYMMDD(formData.expected_go_home_date) 
        : undefined;
      const akcRegistrationDate = formData.akc_registration_date 
        ? formatDateToYYYYMMDD(formData.akc_registration_date) 
        : undefined;
        
      // Prepare data for database
      const litterData = {
        litter_name: formData.litter_name,
        dam_id: formData.dam_id,
        sire_id: formData.sire_id || null,
        birth_date: birthDate,
        expected_go_home_date: expectedGoHomeDate,
        akc_litter_number: formData.akc_litter_number,
        akc_registration_number: formData.akc_registration_number,
        akc_registration_date: akcRegistrationDate,
        akc_verified: formData.akc_verified,
        status: formData.status,
        male_count: formData.male_count,
        female_count: formData.female_count,
        puppy_count: (formData.male_count || 0) + (formData.female_count || 0),
        breeding_notes: formData.breeding_notes,
        notes: formData.notes,
        breeder_id: userId // Add the breeder's ID for tracking
      };
      
      let result;
      
      // Update or create litter based on whether we have an ID
      if (initialData?.id) {
        // Update existing litter
        const { data, error } = await supabase
          .from('litters')
          .update(litterData)
          .eq('id', initialData.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
        
        toast({
          title: 'Litter Updated',
          description: 'The litter has been successfully updated.',
        });
      } else {
        // Create new litter
        const { data, error } = await supabase
          .from('litters')
          .insert(litterData)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
        
        toast({
          title: 'Litter Created',
          description: 'The new litter has been successfully created.',
        });
      }
      
      // Call onSuccess callback
      onSuccess();
      
      return result;
    } catch (error: any) {
      console.error('Error submitting litter form:', error);
      toast({
        title: 'Error',
        description: error.message || 'There was an error saving the litter.',
        variant: 'destructive',
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
