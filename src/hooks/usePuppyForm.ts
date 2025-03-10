
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { PuppyFormData } from '@/components/litters/puppies/types';
import { toast } from '@/components/ui/use-toast';

export interface UsePuppyFormProps {
  litterId: string;
  initialData?: Puppy;
  onSuccess: () => void;
}

export const usePuppyForm = ({ litterId, initialData, onSuccess }: UsePuppyFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PuppyFormData>({
    defaultValues: {
      name: initialData?.name || null,
      gender: initialData?.gender || null,
      status: initialData?.status || 'Available',
      color: initialData?.color || null,
      birth_date: initialData?.birth_date ? new Date(initialData.birth_date) : null,
      birth_weight: initialData?.birth_weight || null,
      current_weight: initialData?.current_weight || null,
      microchip_number: initialData?.microchip_number || null,
      sale_price: initialData?.sale_price || null,
      deworming_dates: initialData?.deworming_dates || null,
      vaccination_dates: initialData?.vaccination_dates || null,
      vet_check_dates: initialData?.vet_check_dates || null,
      notes: initialData?.notes || null,
      photo_url: initialData?.photo_url || null,
    }
  });

  const handleSubmit = async (data: PuppyFormData) => {
    setIsSubmitting(true);
    try {
      // Clean up the data to remove any fields that don't exist in the database schema
      const puppyData = {
        name: data.name,
        gender: data.gender,
        status: data.status,
        color: data.color,
        birth_date: data.birth_date ? data.birth_date.toISOString().split('T')[0] : null,
        birth_weight: data.birth_weight,
        current_weight: data.current_weight,
        microchip_number: data.microchip_number,
        sale_price: data.sale_price,
        deworming_dates: data.deworming_dates,
        vaccination_dates: data.vaccination_dates,
        vet_check_dates: data.vet_check_dates,
        notes: data.notes,
        photo_url: data.photo_url,
        litter_id: litterId
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

      toast({
        title: initialData ? "Puppy Updated" : "Puppy Added",
        description: initialData 
          ? "The puppy information has been successfully updated." 
          : "A new puppy has been successfully added to this litter.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving puppy:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the puppy information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
