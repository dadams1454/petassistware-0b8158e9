
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Medication } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook for managing medications
 */
export function useMedications(dogId: string, enabled = true) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch medications for a dog
  const { 
    data: medications = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['medications', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Medication[];
    },
    enabled: !!dogId && enabled,
  });

  // Add medication
  const { mutateAsync: addMedication } = useMutation({
    mutationFn: async (newMedication: Omit<Medication, 'id' | 'created_at'>) => {
      setIsSubmitting(true);
      try {
        const { data, error } = await supabase
          .from('medications')
          .insert([{
            ...newMedication,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: 'Medication added',
          description: 'The medication has been added successfully.',
        });
        
        return data as Medication;
      } catch (error) {
        console.error('Error adding medication:', error);
        
        toast({
          title: 'Error',
          description: 'Failed to add the medication. Please try again.',
          variant: 'destructive',
        });
        
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', dogId] });
    },
  });

  // Update medication
  const { mutateAsync: updateMedication } = useMutation({
    mutationFn: async (updatedMedication: Medication) => {
      setIsSubmitting(true);
      try {
        const { id, created_at, ...updatableFields } = updatedMedication;
        
        const { data, error } = await supabase
          .from('medications')
          .update(updatableFields)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: 'Medication updated',
          description: 'The medication has been updated successfully.',
        });
        
        return data as Medication;
      } catch (error) {
        console.error('Error updating medication:', error);
        
        toast({
          title: 'Error',
          description: 'Failed to update the medication. Please try again.',
          variant: 'destructive',
        });
        
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', dogId] });
    },
  });

  // Delete medication
  const { mutateAsync: deleteMedication } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', dogId] });
    },
  });

  // Log medication administration
  const { mutateAsync: logAdministration } = useMutation({
    mutationFn: async (params: { medicationId: string, notes: string }) => {
      const { medicationId, notes } = params;
      
      const { data, error } = await supabase
        .from('medication_administrations')
        .insert([{
          medication_id: medicationId,
          administered_date: new Date().toISOString(),
          administered_by: 'current_user', // In a real app, get this from auth context
          notes,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', dogId] });
      queryClient.invalidateQueries({ queryKey: ['medicationAdministrations'] });
    },
  });

  return {
    medications,
    isLoading,
    error,
    isSubmitting,
    addMedication,
    updateMedication,
    deleteMedication,
    logAdministration: (medicationId: string, notes: string) => 
      logAdministration({ medicationId, notes })
  };
}
