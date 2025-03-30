
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Puppy, PuppyFormData } from '@/components/litters/puppies/types';

const puppySchema = z.object({
  name: z.string().optional(),
  gender: z.enum(['Male', 'Female']).default('Male'),
  color: z.string().min(1, 'Color is required'),
  birth_weight: z.string().optional(),
  current_weight: z.string().optional(),
  microchip_number: z.string().optional(),
  status: z.enum(['Available', 'Reserved', 'Sold', 'Unavailable']).default('Available'),
  birth_date: z.date().optional(),
  birth_time: z.string().optional(),
  birth_order: z.number().int().optional(),
  presentation: z.string().optional(),
  assistance_required: z.boolean().default(false),
  assistance_notes: z.string().optional(),
  sale_price: z.number().optional(),
  notes: z.string().optional(),
  weight_notes: z.string().optional(),
});

export type PuppyFormValues = z.infer<typeof puppySchema>;

interface UsePuppyFormProps {
  litterId: string;
  initialData?: Puppy | null;
  onSuccess: () => void;
}

export const usePuppyForm = ({ litterId, initialData, onSuccess }: UsePuppyFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse initialData to match form schema
  const defaultValues: Partial<PuppyFormValues> = {
    name: initialData?.name || '',
    gender: initialData?.gender || 'Male',
    color: initialData?.color || '',
    birth_weight: initialData?.birth_weight || '',
    current_weight: initialData?.current_weight || '',
    microchip_number: initialData?.microchip_number || '',
    status: initialData?.status || 'Available',
    birth_time: initialData?.birth_time || '',
    birth_order: initialData?.birth_order || undefined,
    presentation: initialData?.presentation || '',
    assistance_required: initialData?.assistance_required || false,
    assistance_notes: initialData?.assistance_notes || '',
    sale_price: initialData?.sale_price || undefined,
    notes: initialData?.notes || '',
  };

  // Add birth_date if it exists
  if (initialData?.birth_date) {
    defaultValues.birth_date = new Date(initialData.birth_date);
  }

  const form = useForm<PuppyFormValues>({
    resolver: zodResolver(puppySchema),
    defaultValues
  });

  const handleSubmit = async (values: PuppyFormValues) => {
    setIsSubmitting(true);
    try {
      const puppyData = {
        ...values,
        litter_id: litterId,
        // Format birth_date as ISO string if it exists
        birth_date: values.birth_date ? values.birth_date.toISOString().split('T')[0] : null
      };

      if (initialData) {
        // Update existing puppy
        const { error } = await supabase
          .from('puppies')
          .update(puppyData)
          .eq('id', initialData.id);

        if (error) throw error;

        toast({
          title: 'Puppy updated',
          description: 'The puppy information has been updated successfully.'
        });
      } else {
        // Create new puppy
        const { error } = await supabase
          .from('puppies')
          .insert(puppyData);

        if (error) throw error;

        toast({
          title: 'Puppy added',
          description: 'The puppy has been added to the litter successfully.'
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving puppy:', error);
      toast({
        title: 'Error',
        description: 'There was a problem saving the puppy information.',
        variant: 'destructive'
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
