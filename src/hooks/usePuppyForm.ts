
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Puppy } from '@/components/litters/puppies/types';

export interface PuppyFormValues {
  name: string;
  gender: string;
  color: string;
  birth_date: string;
  microchip_number?: string;
  photo_url?: string;
  current_weight?: string;
  weight_unit?: string;
  status: string;
  birth_order?: string;
  birth_weight?: string;
  birth_time?: string;
  presentation?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  sale_price?: string;
  notes?: string;
  akc_litter_number?: string;
  akc_registration_number?: string;
  health_notes?: string;
  weight_notes?: string;
}

interface UsePuppyFormProps {
  litterId: string;
  initialData?: Puppy | null;
  onSuccess?: () => void;
}

export const usePuppyForm = ({ litterId, initialData, onSuccess }: UsePuppyFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: PuppyFormValues = {
    name: initialData?.name || '',
    gender: initialData?.gender || '',
    color: initialData?.color || '',
    birth_date: initialData?.birth_date || new Date().toISOString().split('T')[0],
    microchip_number: initialData?.microchip_number || '',
    photo_url: initialData?.photo_url || '',
    current_weight: initialData?.current_weight || '',
    weight_unit: initialData?.weight_unit || 'oz',
    status: initialData?.status || 'Available',
    birth_order: initialData?.birth_order?.toString() || '',
    birth_weight: initialData?.birth_weight || '',
    birth_time: initialData?.birth_time || '',
    presentation: initialData?.presentation || '',
    assistance_required: initialData?.assistance_required || false,
    assistance_notes: initialData?.assistance_notes || '',
    sale_price: initialData?.sale_price?.toString() || '',
    notes: initialData?.notes || '',
    akc_litter_number: initialData?.akc_litter_number || '',
    akc_registration_number: initialData?.akc_registration_number || '',
    health_notes: initialData?.health_notes || '',
    weight_notes: initialData?.weight_notes || ''
  };
  
  const form = useForm<PuppyFormValues>({
    defaultValues,
  });
  
  const handleSubmit = async (data: PuppyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format data for database
      const puppyData = {
        ...data,
        litter_id: litterId,
        birth_order: data.birth_order ? parseInt(data.birth_order) : null,
        sale_price: data.sale_price ? parseFloat(data.sale_price) : null,
      };
      
      if (initialData?.id) {
        // Update existing puppy
        const { error } = await supabase
          .from('puppies')
          .update(puppyData)
          .eq('id', initialData.id);
        
        if (error) throw error;
        
        toast({
          title: 'Puppy Updated',
          description: `${data.name || 'Puppy'} has been updated successfully.`,
        });
      } else {
        // Insert new puppy
        const { error } = await supabase
          .from('puppies')
          .insert(puppyData);
        
        if (error) throw error;
        
        toast({
          title: 'Puppy Added',
          description: `${data.name || 'Puppy'} has been added successfully.`,
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving puppy:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the puppy.',
        variant: 'destructive',
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
