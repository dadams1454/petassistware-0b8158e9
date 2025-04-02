
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SocializationExperience } from '@/types/puppyTracking';

export const usePuppySocialization = (puppyId: string) => {
  const queryClient = useQueryClient();
  
  // Fetch socialization experiences
  const { 
    data: experiences = [], 
    isLoading,
    error,
    refetch: refreshExperiences
  } = useQuery({
    queryKey: ['puppy-socialization', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('socialization_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('experience_date', { ascending: false });
      
      if (error) throw error;
      
      return data.map(record => ({
        id: record.id,
        puppy_id: record.puppy_id,
        category: record.category,
        category_id: record.category, // For compatibility with both field names
        experience: record.experience,
        experience_date: record.experience_date,
        reaction: record.reaction,
        notes: record.notes,
        created_at: record.created_at
      })) as SocializationExperience[];
    },
    enabled: !!puppyId
  });
  
  // Add new socialization experience
  const addExperienceMutation = useMutation({
    mutationFn: async (newExperience: {
      category: string;
      experience: string;
      experience_date: string;
      reaction?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('socialization_records')
        .insert({
          puppy_id: puppyId,
          category: newExperience.category,
          experience: newExperience.experience,
          experience_date: newExperience.experience_date,
          reaction: newExperience.reaction,
          notes: newExperience.notes
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppy-socialization', puppyId] });
      toast({
        title: "Experience added",
        description: "The socialization experience has been recorded successfully"
      });
    },
    onError: (error) => {
      console.error('Error adding socialization experience:', error);
      toast({
        title: "Error",
        description: "Failed to add socialization experience",
        variant: "destructive"
      });
    }
  });
  
  // Delete socialization experience
  const deleteExperienceMutation = useMutation({
    mutationFn: async (experienceId: string) => {
      const { error } = await supabase
        .from('socialization_records')
        .delete()
        .eq('id', experienceId);
      
      if (error) throw error;
      return experienceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppy-socialization', puppyId] });
      toast({
        title: "Experience deleted",
        description: "The socialization experience has been removed"
      });
    },
    onError: (error) => {
      console.error('Error deleting socialization experience:', error);
      toast({
        title: "Error",
        description: "Failed to delete socialization experience",
        variant: "destructive"
      });
    }
  });
  
  return {
    experiences,
    isLoading,
    error,
    addExperience: (data: {
      category: string;
      experience: string;
      experience_date: string;
      reaction?: string;
      notes?: string;
    }) => addExperienceMutation.mutate(data),
    deleteExperience: (id: string) => deleteExperienceMutation.mutate(id),
    refreshExperiences: () => refreshExperiences()
  };
};
