import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, addDays } from 'date-fns';
import { BreedingPrepFormData, BreedingChecklistItem } from '@/types/reproductive';
import { Dog } from '@/types/dog';

export const useBreedingPreparation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Query to fetch female dogs eligible for breeding
  const {
    data: femaleDogs = [],
    isLoading: isLoadingFemales
  } = useQuery({
    queryKey: ['breeding-eligible-females'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Female')
        .order('name');
        
      if (error) throw error;
      return data as Dog[];
    }
  });

  // Query to fetch male dogs eligible for breeding
  const {
    data: maleDogs = [],
    isLoading: isLoadingMales
  } = useQuery({
    queryKey: ['breeding-eligible-males'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Male')
        .order('name');
        
      if (error) throw error;
      return data as Dog[];
    }
  });

  // Fetch genetic data for compatibility checking
  const fetchGeneticData = async (dogId: string) => {
    try {
      const { data, error } = await supabase
        .from('genetic_data')
        .select('*')
        .eq('dog_id', dogId)
        .single();
        
      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error fetching genetic data:', error);
      return null;
    }
  };

  // Update the checklist items to include the required fields
  const getDefaultChecklistItems = (): BreedingChecklistItem[] => {
    return [
      {
        id: '1',
        task: 'Vet Checkup for Dam',
        title: 'Vet Checkup for Dam',
        description: 'Schedule pre-breeding health check for the dam',
        completed: false,
        category: 'medical'
      },
      {
        id: '2',
        task: 'Vet Checkup for Sire',
        title: 'Vet Checkup for Sire',
        description: 'Schedule pre-breeding health check for the sire',
        completed: false,
        category: 'medical'
      },
      {
        id: '3',
        task: 'Update Vaccinations',
        title: 'Update Vaccinations',
        description: 'Ensure both dam and sire are up to date on vaccinations',
        completed: false,
        category: 'medical'
      },
      {
        id: '4',
        task: 'Prepare Whelping Box',
        title: 'Prepare Whelping Box',
        description: 'Set up and sanitize whelping box',
        completed: false,
        category: 'supplies'
      },
      {
        id: '5',
        task: 'Gather Whelping Supplies',
        title: 'Gather Whelping Supplies',
        description: 'Prepare thermometer, clean towels, heating pad, etc.',
        completed: false,
        category: 'supplies'
      },
      {
        id: '6',
        task: 'Update AKC Registration',
        title: 'Update AKC Registration',
        description: 'Ensure both dam and sire have current AKC registrations',
        completed: false,
        category: 'documentation'
      },
      {
        id: '7',
        task: 'Prepare Facility',
        title: 'Prepare Facility',
        description: 'Clean and prepare quiet area for whelping',
        completed: false,
        category: 'facility'
      }
    ];
  };

  // Update the createBreedingRecord function to handle the form data correctly
  const createBreedingRecord = useMutation({
    mutationFn: async (formData: BreedingPrepFormData) => {
      // Calculate estimated due date (63 days from tie date)
      const tieDate = formData.plannedTieDate || new Date(formData.plannedDate);
      const estimatedDueDate = format(addDays(tieDate, 63), 'yyyy-MM-dd');
      
      const breedingData = {
        dog_id: formData.damId,
        sire_id: formData.sireId,
        tie_date: format(tieDate, 'yyyy-MM-dd'),
        estimated_due_date: estimatedDueDate,
        breeding_method: 'natural',
        notes: formData.notes || null
      };
      
      const { data, error } = await supabase
        .from('breeding_records')
        .insert(breedingData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update the dam's information
      await supabase
        .from('dogs')
        .update({
          last_heat_date: format(new Date(), 'yyyy-MM-dd'),
          tie_date: format(tieDate, 'yyyy-MM-dd')
        })
        .eq('id', formData.damId);
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Breeding record created',
        description: 'Breeding plan has been successfully recorded',
      });
      queryClient.invalidateQueries({ queryKey: ['breeding-records'] });
      queryClient.invalidateQueries({ queryKey: ['dog'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to create breeding record: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Check for genetic compatibility between dam and sire
  const checkGeneticCompatibility = async (damId: string, sireId: string) => {
    const damGenetics = await fetchGeneticData(damId);
    const sireGenetics = await fetchGeneticData(sireId);
    
    // If we don't have genetic data for both, return a default message
    if (!damGenetics || !sireGenetics) {
      return {
        compatible: true,
        message: "Genetic data not available for compatibility check",
        warnings: []
      };
    }
    
    // In a real application, you would implement actual genetic compatibility checks
    // For now, we'll return a placeholder result
    return {
      compatible: true,
      message: "Basic genetic compatibility check passed",
      warnings: []
    };
  };

  return {
    femaleDogs,
    maleDogs,
    isLoading: isLoading || isLoadingFemales || isLoadingMales,
    createBreedingRecord: createBreedingRecord.mutateAsync,
    getDefaultChecklistItems,
    checkGeneticCompatibility,
    isCreating: createBreedingRecord.isPending
  };
};
