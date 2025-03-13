
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface LitterFormData {
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
  // AKC compliance fields
  akc_registration_number: string | null;
  akc_registration_date: Date | null;
  akc_breeder_id: string | null;
  akc_litter_color: string | null;
  akc_documents_url: string | null;
  akc_verified: boolean | null;
  // Breeding details
  first_mating_date: Date | null;
  last_mating_date: Date | null;
  kennel_name: string | null;
  breeding_notes: string | null;
}

interface UseLitterFormProps {
  initialData?: Litter;
  onSuccess: () => void;
}

export const useLitterForm = ({ initialData, onSuccess }: UseLitterFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousDamId, setPreviousDamId] = useState<string | null>(initialData?.dam_id || null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initialize form with initial data values
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
      documents_url: initialData?.documents_url || null,
      // AKC compliance fields
      akc_registration_number: initialData?.akc_registration_number || null,
      akc_registration_date: initialData?.akc_registration_date ? new Date(initialData.akc_registration_date) : null,
      akc_breeder_id: initialData?.akc_breeder_id || null,
      akc_litter_color: initialData?.akc_litter_color || null,
      akc_documents_url: initialData?.akc_documents_url || null,
      akc_verified: initialData?.akc_verified || false,
      // Breeding details
      first_mating_date: initialData?.first_mating_date ? new Date(initialData.first_mating_date) : null,
      last_mating_date: initialData?.last_mating_date ? new Date(initialData.last_mating_date) : null,
      kennel_name: initialData?.kennel_name || null,
      breeding_notes: initialData?.breeding_notes || null,
    }
  });

  // Watch dam_id to detect changes
  const currentDamId = form.watch('dam_id');
  
  // Watch male and female count to auto-calculate total puppies
  const maleCount = form.watch('male_count');
  const femaleCount = form.watch('female_count');
  
  // Fetch dam details when dam_id changes or when initializing with existing data
  const { data: damDetails } = useQuery({
    queryKey: ['dam-details', currentDamId],
    queryFn: async () => {
      if (!currentDamId || currentDamId === 'none') return null;
      
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', currentDamId)
        .single();
      
      if (error) {
        console.error('Error fetching dam details:', error);
        return null;
      }
      
      console.log('Successfully fetched dam details:', data);
      return data;
    },
    enabled: !!currentDamId && currentDamId !== 'none',
  });

  const handleSubmit = async (data: LitterFormData) => {
    setIsSubmitting(true);
    try {
      // Debug logging
      console.log('Submitting form with data:', data);
      
      // Process the data to handle null values and date formatting
      const processedData = {
        ...data,
        birth_date: data.birth_date.toISOString().split('T')[0],
        expected_go_home_date: data.expected_go_home_date.toISOString().split('T')[0],
        akc_registration_date: data.akc_registration_date?.toISOString().split('T')[0] || null,
        first_mating_date: data.first_mating_date?.toISOString().split('T')[0] || null,
        last_mating_date: data.last_mating_date?.toISOString().split('T')[0] || null,
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
        
        // If this is a new litter and we have dam details, update the dam's litter count
        if (damDetails && currentDamId) {
          const newLitterNumber = (damDetails.litter_number || 0) + 1;
          await supabase
            .from('dogs')
            .update({ litter_number: newLitterNumber })
            .eq('id', currentDamId);
          
          console.log(`Updated dam's litter count to ${newLitterNumber}`);
        }
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
    form,
    isSubmitting,
    damDetails,
    previousDamId,
    setPreviousDamId,
    isInitialLoad,
    setIsInitialLoad,
    maleCount,
    femaleCount,
    currentDamId,
    handleSubmit
  };
};
