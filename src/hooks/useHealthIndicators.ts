
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HealthIndicator, HealthIndicatorType } from '@/types/health';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';

export const useHealthIndicators = (dogId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutation to add a health indicator
  const addHealthIndicator = useMutation({
    mutationFn: async (indicator: Omit<HealthIndicator, 'id' | 'created_at'>) => {
      setIsSubmitting(true);
      try {
        const formattedDate = formatDateToYYYYMMDD(indicator.record_date);
        
        const { data, error } = await supabase
          .from('health_indicators')
          .insert({
            ...indicator,
            dog_id: dogId,
            record_date: formattedDate
          })
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        toast({
          title: 'Health indicator added',
          description: 'The health indicator has been successfully recorded.'
        });
        
        return data;
      } catch (error: any) {
        console.error('Error adding health indicator:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to add health indicator',
          variant: 'destructive'
        });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog-health-indicators', dogId] });
    }
  });

  // Mutation to update a health indicator
  const updateHealthIndicator = useMutation({
    mutationFn: async ({ id, ...updates }: HealthIndicator) => {
      setIsSubmitting(true);
      try {
        if (updates.record_date) {
          updates.record_date = formatDateToYYYYMMDD(updates.record_date);
        }
        
        const { data, error } = await supabase
          .from('health_indicators')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
          
        if (error) {
          throw error;
        }
        
        toast({
          title: 'Health indicator updated',
          description: 'The health indicator has been successfully updated.'
        });
        
        return data;
      } catch (error: any) {
        console.error('Error updating health indicator:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to update health indicator',
          variant: 'destructive'
        });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog-health-indicators', dogId] });
    }
  });

  // Mutation to delete a health indicator
  const deleteHealthIndicator = useMutation({
    mutationFn: async (id: string) => {
      setIsSubmitting(true);
      try {
        const { error } = await supabase
          .from('health_indicators')
          .delete()
          .eq('id', id);
          
        if (error) {
          throw error;
        }
        
        toast({
          title: 'Health indicator deleted',
          description: 'The health indicator has been successfully deleted.'
        });
        
        return id;
      } catch (error: any) {
        console.error('Error deleting health indicator:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete health indicator',
          variant: 'destructive'
        });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dog-health-indicators', dogId] });
    }
  });

  return {
    addHealthIndicator: addHealthIndicator.mutate,
    updateHealthIndicator: updateHealthIndicator.mutate,
    deleteHealthIndicator: deleteHealthIndicator.mutate,
    isSubmitting
  };
};
