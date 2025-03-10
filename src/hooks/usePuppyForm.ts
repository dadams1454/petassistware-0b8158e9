
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { PuppyFormData } from '@/components/litters/puppies/types';

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
      const puppyData = {
        ...data,
        litter_id: litterId,
        birth_date: data.birth_date ? data.birth_date.toISOString().split('T')[0] : null,
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

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
