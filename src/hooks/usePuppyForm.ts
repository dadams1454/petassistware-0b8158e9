
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { PuppyFormData, Puppy } from '@/components/litters/puppies/types';
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
      name: initialData?.name || '',
      gender: initialData?.gender || '',
      status: (initialData?.status as 'Available' | 'Reserved' | 'Sold' | 'Kept' | 'Deceased') || 'Available',
      color: initialData?.color || '',
      birth_date: initialData?.birth_date ? new Date(initialData.birth_date) : null,
      birth_weight: initialData?.birth_weight || '',
      current_weight: initialData?.current_weight || '',
      microchip_number: initialData?.microchip_number || '',
      sale_price: initialData?.sale_price || null,
      deworming_dates: initialData?.deworming_dates || '',
      vaccination_dates: initialData?.vaccination_dates || '',
      vet_check_dates: initialData?.vet_check_dates || '',
      notes: initialData?.notes || '',
      photo_url: initialData?.photo_url || '',
      birth_time: initialData?.birth_time || '',
      akc_litter_number: initialData?.akc_litter_number || '',
      akc_registration_number: initialData?.akc_registration_number || ''
    }
  });

  const handleSubmit = async (data: PuppyFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting puppy data:', data);
      
      // Format gender properly (capitalize first letter)
      const formattedGender = data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase() : null;
      
      // Parse sale price to number or null - fixing the type error
      let salePrice = null;
      if (data.sale_price !== null && data.sale_price !== undefined) {
        // Convert to string first to safely check for empty string
        const priceStr = String(data.sale_price);
        if (priceStr.trim() !== '') {
          const price = Number(priceStr);
          if (!isNaN(price)) {
            salePrice = price;
          }
        }
      }

      // Parse weight to number or null
      let birthWeight = null;
      if (data.birth_weight !== null && data.birth_weight !== undefined) {
        const weightStr = String(data.birth_weight);
        if (weightStr.trim() !== '') {
          const weight = Number(weightStr);
          if (!isNaN(weight)) {
            birthWeight = weight;
          }
        }
      }

      let currentWeight = null;
      if (data.current_weight !== null && data.current_weight !== undefined) {
        const weightStr = String(data.current_weight);
        if (weightStr.trim() !== '') {
          const weight = Number(weightStr);
          if (!isNaN(weight)) {
            currentWeight = weight;
          }
        }
      }
      
      // Clean up the data to remove any fields that don't exist in the database schema
      const puppyData = {
        name: data.name || null,
        gender: formattedGender as 'Male' | 'Female' | null,
        status: data.status,
        color: data.color || null,
        birth_date: data.birth_date ? data.birth_date.toISOString().split('T')[0] : null,
        birth_weight: birthWeight,
        current_weight: currentWeight,
        microchip_number: data.microchip_number || null,
        sale_price: salePrice,
        deworming_dates: data.deworming_dates || null,
        vaccination_dates: data.vaccination_dates || null,
        vet_check_dates: data.vet_check_dates || null,
        notes: data.notes || null,
        photo_url: data.photo_url || null,
        litter_id: litterId,
        birth_time: data.birth_time || null,
        akc_litter_number: data.akc_litter_number || null,
        akc_registration_number: data.akc_registration_number || null
      };

      console.log('Cleaned puppy data for submission:', puppyData);

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
