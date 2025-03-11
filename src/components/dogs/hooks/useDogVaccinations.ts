
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Vaccination } from '../types/vaccination';

// Type to properly handle the Supabase response
type VaccinationResponse = {
  id: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: string;
  notes: string | null;
  created_at: string;
}

export const useDogVaccinations = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingVaccination, setIsAddingVaccination] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch vaccinations for a dog
  const { data: vaccinations, isLoading, error } = useQuery({
    queryKey: ['dogVaccinations', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dog_vaccinations')
        .select('*')
        .eq('dog_id', dogId)
        .order('vaccination_date', { ascending: false }) as { data: VaccinationResponse[] | null, error: any };
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!dogId,
  });

  // Add a new vaccination
  const addVaccinationMutation = useMutation({
    mutationFn: async (vaccination: Vaccination) => {
      setFormError(null);
      
      // Validate required fields
      if (!vaccination.vaccination_type) {
        throw new Error('Vaccination type is required');
      }
      
      if (!vaccination.vaccination_date) {
        throw new Error('Vaccination date is required');
      }
      
      // Validate date is not in the future
      const vaccDate = new Date(vaccination.vaccination_date);
      const today = new Date();
      if (vaccDate > today) {
        throw new Error('Vaccination date cannot be in the future');
      }
      
      // Remove the vaccination_dateStr property as it's not needed in the database
      const { vaccination_dateStr, ...vaccinationData } = vaccination;
      
      // Ensure date is properly formatted as string for Supabase
      const formattedVaccination = {
        ...vaccinationData,
        vaccination_date: typeof vaccination.vaccination_date === 'string' 
          ? vaccination.vaccination_date 
          : vaccination.vaccination_date instanceof Date
            ? vaccination.vaccination_date.toISOString().split('T')[0]
            : null,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('dog_vaccinations')
        .insert(formattedVaccination)
        .select() as { data: VaccinationResponse[] | null, error: any };
      
      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      toast({
        title: 'Vaccination Added',
        description: 'The vaccination record has been successfully added.',
      });
      queryClient.invalidateQueries({ queryKey: ['dogVaccinations', dogId] });
      setIsAddingVaccination(false);
      setFormError(null);
    },
    onError: (error: Error) => {
      setFormError(error.message);
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
        .eq('id', vaccinationId) as { error: any };
      
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
    onError: (error: Error) => {
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
    formError,
    isAddingVaccination,
    setIsAddingVaccination,
    addVaccination: addVaccinationMutation.mutate,
    deleteVaccination: deleteVaccinationMutation.mutate,
    isAdding: addVaccinationMutation.isPending,
    isDeleting: deleteVaccinationMutation.isPending,
  };
};
