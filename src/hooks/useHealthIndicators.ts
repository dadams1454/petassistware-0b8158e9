
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { HealthIndicator } from '@/types';

export function useHealthIndicators(dogId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch health indicators
  const { 
    data: healthIndicators = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['healthIndicators', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_indicators')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as HealthIndicator[];
    },
    enabled: !!dogId,
  });

  // Add health indicator mutation
  const { mutateAsync: addHealthIndicator } = useMutation({
    mutationFn: async (newIndicator: Omit<HealthIndicator, 'id' | 'created_at'>) => {
      setIsSubmitting(true);
      try {
        const { data, error } = await supabase
          .from('health_indicators')
          .insert([{
            ...newIndicator,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        // Show success message
        toast({
          title: 'Health indicators saved',
          description: 'Your dog\'s health indicators have been recorded successfully.',
        });
        
        return data;
      } catch (error) {
        console.error('Error adding health indicator:', error);
        
        // Show error message
        toast({
          title: 'Failed to save health indicators',
          description: 'An error occurred while saving the health indicators. Please try again.',
          variant: 'destructive',
        });
        
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthIndicators', dogId] });
    },
  });

  // Update health indicator mutation
  const { mutateAsync: updateHealthIndicator } = useMutation({
    mutationFn: async (updatedIndicator: HealthIndicator) => {
      setIsSubmitting(true);
      try {
        const { id, created_at, ...updatableFields } = updatedIndicator;
        
        const { data, error } = await supabase
          .from('health_indicators')
          .update(updatableFields)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: 'Health indicators updated',
          description: 'Your dog\'s health indicators have been updated successfully.',
        });
        
        return data;
      } catch (error) {
        console.error('Error updating health indicator:', error);
        
        toast({
          title: 'Failed to update health indicators',
          description: 'An error occurred while updating the health indicators. Please try again.',
          variant: 'destructive',
        });
        
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthIndicators', dogId] });
    },
  });

  // Delete health indicator mutation
  const { mutateAsync: deleteHealthIndicator } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('health_indicators')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Health indicator deleted',
        description: 'The health indicator has been deleted successfully.',
      });
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthIndicators', dogId] });
    },
  });

  return {
    healthIndicators,
    isLoading,
    error,
    isSubmitting,
    addHealthIndicator,
    updateHealthIndicator,
    deleteHealthIndicator,
  };
}
