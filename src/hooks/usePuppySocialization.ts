
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  SocializationCategory, 
  SocializationExperience, 
  SocializationProgress 
} from '@/types/puppyTracking';
import { 
  SOCIALIZATION_CATEGORIES, 
  getSocializationTargetsByAge 
} from '@/data/socializationCategories';

export const usePuppySocialization = (puppyId: string) => {
  const queryClient = useQueryClient();
  const [puppyAge, setPuppyAge] = useState<number>(0);
  
  // Get puppy data to determine age
  const { data: puppy } = useQuery({
    queryKey: ['puppy-basic', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puppies')
        .select(`
          id, 
          birth_date,
          litter:litter_id (birth_date)
        `)
        .eq('id', puppyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!puppyId
  });
  
  // Calculate puppy age based on birth date
  useEffect(() => {
    if (puppy) {
      const birthDate = puppy.birth_date || puppy.litter?.birth_date;
      if (birthDate) {
        const birthDateObj = new Date(birthDate);
        const today = new Date();
        const ageInDays = Math.floor((today.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24));
        setPuppyAge(ageInDays);
      }
    }
  }, [puppy]);
  
  // Fetch socialization experiences
  const { 
    data: experiences = [], 
    isLoading: isLoadingExperiences,
    error: experiencesError 
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
        category_id: record.category,
        experience: record.experience,
        experience_date: record.experience_date,
        reaction: record.reaction,
        notes: record.notes,
        created_at: record.created_at
      })) as SocializationExperience[];
    },
    enabled: !!puppyId
  });
  
  // Calculate progress per category
  const socializationProgress = SOCIALIZATION_CATEGORIES.map(category => {
    const categoryExperiences = experiences.filter(exp => exp.category_id === category.id);
    const targetCount = getSocializationTargetsByAge(puppyAge);
    const count = categoryExperiences.length;
    const completionPercentage = Math.min(Math.round((count / targetCount) * 100), 100);
    
    return {
      categoryId: category.id,
      categoryName: category.name,
      count,
      target: targetCount,
      completionPercentage
    } as SocializationProgress;
  });
  
  // Overall progress
  const totalExperiences = experiences.length;
  const totalTarget = getSocializationTargetsByAge(puppyAge) * SOCIALIZATION_CATEGORIES.length;
  const overallProgress = Math.min(Math.round((totalExperiences / totalTarget) * 100), 100);
  
  // Add new socialization experience
  const addExperienceMutation = useMutation({
    mutationFn: async (newExperience: {
      category_id: string;
      experience: string;
      experience_date: string;
      reaction?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('socialization_records')
        .insert({
          puppy_id: puppyId,
          category: newExperience.category_id,
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
    categories: SOCIALIZATION_CATEGORIES,
    isLoading: isLoadingExperiences,
    error: experiencesError,
    socializationProgress,
    overallProgress,
    puppyAge,
    addExperience: (data: {
      category_id: string;
      experience: string;
      experience_date: string;
      reaction?: string;
      notes?: string;
    }) => addExperienceMutation.mutate(data),
    deleteExperience: (id: string) => deleteExperienceMutation.mutate(id),
    isAddingExperience: addExperienceMutation.isPending,
    isDeletingExperience: deleteExperienceMutation.isPending
  };
};
