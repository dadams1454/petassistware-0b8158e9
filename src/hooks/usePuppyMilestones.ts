
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, isBefore, isAfter, parseISO, addDays } from 'date-fns';

export const usePuppyMilestones = (puppyId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchPuppyAge = async () => {
    if (!puppyId) return 0;
    
    const { data, error } = await supabase
      .from('puppies')
      .select('birth_date, litter:litter_id(birth_date)')
      .eq('id', puppyId)
      .single();
    
    if (error) throw error;
    
    const birthDate = data.birth_date || data.litter?.birth_date;
    if (!birthDate) return 0;
    
    return differenceInDays(new Date(), new Date(birthDate));
  };

  // Fetch milestone data
  const { 
    data: milestones = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['puppy-milestones', puppyId],
    queryFn: async () => {
      if (!puppyId) return [];
      
      const { data, error } = await supabase
        .from('puppy_milestones')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('target_date', { ascending: true });
      
      if (error) throw error;
      
      // If no milestones exist, create default ones
      if (data.length === 0) {
        const ageInDays = await fetchPuppyAge();
        await createDefaultMilestones(puppyId, ageInDays);
        
        const { data: newData, error: newError } = await supabase
          .from('puppy_milestones')
          .select('*')
          .eq('puppy_id', puppyId)
          .order('target_date', { ascending: true });
        
        if (newError) throw newError;
        return newData;
      }
      
      return data;
    },
    enabled: !!puppyId
  });
  
  // Create default milestones for a puppy
  const createDefaultMilestones = async (puppyId: string, currentAge: number) => {
    const today = new Date();
    const defaultMilestones = [
      // Physical milestones
      {
        puppy_id: puppyId,
        title: 'Eyes Open',
        description: 'Puppy\'s eyes should be open and beginning to see',
        category: 'physical',
        expected_age_days: 14,
        target_date: addDays(today, Math.max(14 - currentAge, 0)).toISOString().split('T')[0],
      },
      {
        puppy_id: puppyId,
        title: 'Ears Open',
        description: 'Puppy\'s ear canals should be open and beginning to hear',
        category: 'physical',
        expected_age_days: 21,
        target_date: addDays(today, Math.max(21 - currentAge, 0)).toISOString().split('T')[0],
      },
      {
        puppy_id: puppyId,
        title: 'First Solid Food',
        description: 'Introduction to solid food and beginning to wean',
        category: 'physical',
        expected_age_days: 28,
        target_date: addDays(today, Math.max(28 - currentAge, 0)).toISOString().split('T')[0],
      },
      // Health milestones
      {
        puppy_id: puppyId,
        title: 'First Deworming',
        description: 'First deworming treatment',
        category: 'health',
        expected_age_days: 14,
        target_date: addDays(today, Math.max(14 - currentAge, 0)).toISOString().split('T')[0],
      },
      {
        puppy_id: puppyId,
        title: 'First Vet Check',
        description: 'Initial veterinary examination',
        category: 'health',
        expected_age_days: 42,
        target_date: addDays(today, Math.max(42 - currentAge, 0)).toISOString().split('T')[0],
      },
      // Behavioral milestones
      {
        puppy_id: puppyId,
        title: 'First Walk Outside',
        description: 'First supervised exploration of outdoor environment',
        category: 'behavioral',
        expected_age_days: 49,
        target_date: addDays(today, Math.max(49 - currentAge, 0)).toISOString().split('T')[0],
      },
      {
        puppy_id: puppyId,
        title: 'Introduction to Collar/Leash',
        description: 'First time wearing collar and being introduced to leash',
        category: 'behavioral',
        expected_age_days: 56,
        target_date: addDays(today, Math.max(56 - currentAge, 0)).toISOString().split('T')[0],
      }
    ];

    // Insert default milestones
    const { error } = await supabase
      .from('puppy_milestones')
      .insert(defaultMilestones);
    
    if (error) {
      console.error("Error creating default milestones:", error);
      throw error;
    }
  };

  // Mark a milestone as complete
  const markMilestoneComplete = useMutation({
    mutationFn: async (milestoneId: string) => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('puppy_milestones')
        .update({ completion_date: today })
        .eq('id', milestoneId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppy-milestones', puppyId] });
      toast({
        title: 'Milestone Completed',
        description: 'The milestone has been marked as completed.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to complete milestone: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Add a custom milestone
  const addMilestone = useMutation({
    mutationFn: async (milestoneData: {
      title: string;
      description?: string;
      category: 'physical' | 'health' | 'behavioral';
      expected_age_days?: number;
      target_date: string;
    }) => {
      const { data, error } = await supabase
        .from('puppy_milestones')
        .insert({
          puppy_id: puppyId,
          ...milestoneData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppy-milestones', puppyId] });
      toast({
        title: 'Milestone Added',
        description: 'The new milestone has been added successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to add milestone: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Process milestones into categories: completed, upcoming, overdue
  const completedMilestones = milestones.filter(milestone => milestone.completion_date);
  
  const pendingMilestones = milestones.filter(milestone => !milestone.completion_date);
  
  const overdueMilestones = pendingMilestones.filter(milestone => 
    milestone.target_date && isBefore(new Date(milestone.target_date), new Date())
  );
  
  const upcomingMilestones = pendingMilestones.filter(milestone => 
    milestone.target_date && !isBefore(new Date(milestone.target_date), new Date())
  );

  return {
    milestones,
    completedMilestones,
    upcomingMilestones,
    overdueMilestones,
    isLoading,
    error,
    markComplete: markMilestoneComplete.mutate,
    addMilestone: addMilestone.mutate
  };
};
