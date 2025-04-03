
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Puppy } from '@/types/litter';

export interface PuppyFormValues {
  name?: string;
  gender?: 'Male' | 'Female';
  color?: string;
  birth_order?: number;
  birth_weight?: string;
  birth_time?: string;
  presentation?: string;
  assistance_required?: boolean;
  assistance_notes?: string;
  // AKC
  akc_litter_number?: string;
  akc_registration_number?: string;
  // Health
  health_notes?: string;
  vaccination_dates?: string;
  deworming_dates?: string;
  vet_check_dates?: string;
  weight_notes?: string;
  // Sale
  status?: 'Available' | 'Reserved' | 'Sold' | 'Unavailable';
  sale_price?: number;
  notes?: string;
}

interface PuppyFormProps {
  litterId: string;
  initialData?: Partial<Puppy> | null;
  onSuccess?: () => void;
}

export const usePuppyForm = ({ litterId, initialData, onSuccess }: PuppyFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Convert initialData to form values
  const formValues: PuppyFormValues = initialData ? {
    name: initialData.name || '',
    gender: initialData.gender as 'Male' | 'Female' || undefined,
    color: initialData.color || '',
    birth_order: initialData.birth_order || undefined,
    birth_weight: initialData.birth_weight || '',
    birth_time: initialData.birth_time || '',
    presentation: initialData.presentation || '',
    assistance_required: initialData.assistance_required || false,
    assistance_notes: initialData.assistance_notes || '',
    // AKC
    akc_litter_number: initialData.akc_litter_number || '',
    akc_registration_number: initialData.akc_registration_number || '',
    // Health
    health_notes: initialData.notes || '',
    weight_notes: initialData.notes || '',
    vaccination_dates: initialData.vaccination_dates || '',
    deworming_dates: initialData.deworming_dates || '',
    vet_check_dates: initialData.vet_check_dates || '',
    // Sale
    status: initialData.status as 'Available' | 'Reserved' | 'Sold' | 'Unavailable' || 'Available',
    sale_price: initialData.sale_price || undefined,
    notes: initialData.notes || ''
  } : {
    status: 'Available',
    gender: undefined,
    notes: ''
  };
  
  // Initialize form
  const form = useForm<PuppyFormValues>({
    defaultValues: formValues
  });
  
  const handleSubmit = async (data: PuppyFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (initialData?.id) {
        // Update existing puppy
        const { error } = await supabase
          .from('puppies')
          .update({
            name: data.name,
            gender: data.gender,
            color: data.color,
            birth_order: data.birth_order,
            birth_weight: data.birth_weight,
            birth_time: data.birth_time, 
            presentation: data.presentation,
            assistance_required: data.assistance_required,
            assistance_notes: data.assistance_notes,
            akc_litter_number: data.akc_litter_number,
            akc_registration_number: data.akc_registration_number,
            vaccination_dates: data.vaccination_dates,
            deworming_dates: data.deworming_dates,
            vet_check_dates: data.vet_check_dates,
            status: data.status,
            sale_price: data.sale_price,
            notes: data.notes
          })
          .eq('id', initialData.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Puppy updated successfully!",
        });
      } else {
        // Create new puppy
        const { error } = await supabase
          .from('puppies')
          .insert({
            litter_id: litterId,
            name: data.name,
            gender: data.gender,
            color: data.color,
            birth_date: new Date().toISOString().split('T')[0], // Today's date
            birth_order: data.birth_order,
            birth_weight: data.birth_weight,
            birth_time: data.birth_time,
            presentation: data.presentation,
            assistance_required: data.assistance_required,
            assistance_notes: data.assistance_notes,
            akc_litter_number: data.akc_litter_number,
            akc_registration_number: data.akc_registration_number,
            vaccination_dates: data.vaccination_dates,
            deworming_dates: data.deworming_dates,
            vet_check_dates: data.vet_check_dates,
            status: data.status || 'Available',
            sale_price: data.sale_price,
            notes: data.notes
          });
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "New puppy added successfully!",
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving puppy:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the puppy data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    isSubmitting,
    handleSubmit
  };
};
