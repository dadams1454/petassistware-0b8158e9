
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Vaccination } from '../types/vaccination';

export const useDogVaccinations = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingVaccination, setIsAddingVaccination] = useState(false);

  // Fetch vaccinations for a dog
  const { data: vaccinations, isLoading, error } = useQuery({
    queryKey: ['dogVaccinations', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dog_vaccinations')
        .select('*')
        .eq('dog_id', dogId)
        .order('vaccination_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!dogId,
  });

  // Add a new vaccination
  const addVaccinationMutation = useMutation({
    mutationFn: async (vaccination: Vaccination) => {
      const { data, error } = await supabase
        .from('dog_vaccinations')
        .insert(vaccination)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: 'Vaccination Added',
        description: 'The vaccination record has been successfully added.',
      });
      queryClient.invalidateQueries({ queryKey: ['dogVaccinations', dogId] });
      setIsAddingVaccination(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add vaccination: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete a vaccination
  const deleteVaccinationMutation = useMutation({
    mutationFn: async (vaccinationId: string) => {
      const { error } = await supabase
        .from('dog_vaccinations')
        .delete()
        .eq('id', vaccinationId);
      
      if (error) throw error;
      return vaccinationId;
    },
    onSuccess: () => {
      toast({
        title: 'Vaccination Deleted',
        description: 'The vaccination record has been successfully deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['dogVaccinations', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete vaccination: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    vaccinations,
    isLoading,
    error,
    isAddingVaccination,
    setIsAddingVaccination,
    addVaccination: addVaccinationMutation.mutate,
    deleteVaccination: deleteVaccinationMutation.mutate,
    isAdding: addVaccinationMutation.isPending,
    isDeleting: deleteVaccinationMutation.isPending,
  };
};
