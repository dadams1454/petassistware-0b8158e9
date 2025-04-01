
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, isBefore, isAfter, parseISO, addDays } from 'date-fns';
import { PuppyMilestone } from '@/types/puppyTracking';

// Helper function to extract category from milestone_type
const getCategoryFromType = (milestone_type: string): string => {
  if (milestone_type.includes(':')) {
    return milestone_type.split(':')[0];
  }
  
  // Default mapping based on type
  if (milestone_type.includes('deworming') || milestone_type.includes('vet') || 
      milestone_type.includes('vaccine')) {
    return 'health';
  } else if (milestone_type.includes('walk') || milestone_type.includes('collar') || 
            milestone_type.includes('social')) {
    return 'behavioral';
  }
  return 'physical'; // Default category
};

// Helper to get title from milestone_type
const getTitleFromType = (milestone_type: string): string => {
  if (milestone_type.includes(':')) {
    const parts = milestone_type.split(':');
    return parts[1].split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  return milestone_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

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
        .order('milestone_date', { ascending: true });
      
      if (error) throw error;
      
      // If no milestones exist, create default ones
      if (data.length === 0) {
        const ageInDays = await fetchPuppyAge();
        await createDefaultMilestones(puppyId, ageInDays);
        
        const { data: newData, error: newError } = await supabase
          .from('puppy_milestones')
          .select('*')
          .eq('puppy_id', puppyId)
          .order('milestone_date', { ascending: true });
        
        if (newError) throw newError;
        return enhanceMilestones(newData || []);
      }
      
      return enhanceMilestones(data);
    },
    enabled: !!puppyId
  });
  
  // Add UI-specific fields to milestones
  const enhanceMilestones = (dbMilestones: any[]): PuppyMilestone[] => {
    return dbMilestones.map(milestone => ({
      ...milestone,
      title: getTitleFromType(milestone.milestone_type),
      category: getCategoryFromType(milestone.milestone_type),
      target_date: milestone.milestone_date,
      completion_date: milestone.notes?.includes('COMPLETED:') 
        ? milestone.notes.split('COMPLETED:')[1].trim()
        : undefined,
      description: milestone.notes?.includes('COMPLETED:') 
        ? milestone.notes.split('COMPLETED:')[0].trim() 
        : milestone.notes
    }));
  };
  
  // Create default milestones for a puppy
  const createDefaultMilestones = async (puppyId: string, currentAge: number) => {
    const today = new Date();
    const defaultMilestones = [
      // Physical milestones
      {
        puppy_id: puppyId,
        milestone_type: "physical:eyes_open",
        notes: "Puppy's eyes should be open and beginning to see",
        milestone_date: addDays(today, Math.max(14 - currentAge, 0)).toISOString().split('T')[0],
      },
      {
        puppy_id: puppyId,
        milestone_type: "physical:ears_open",
        notes: "Puppy's ear canals should be open and beginning to hear",
        milestone_date: addDays(today, Math.max(21 - currentAge, 0)).toISOString().split('T')[0],
      },
      {
        puppy_id: puppyId,
        milestone_type: "physical:solid_food",
        notes: "Introduction to solid food and beginning to wean",
        milestone_date: addDays(today, Math.max(28 - currentAge, 0)).toISOString().split('T')[0],
      },
      // Health milestones
      {
        puppy_id: puppyId,
        milestone_type: "health:first_deworming",
        notes: "First deworming treatment",
        milestone_date: addDays(today, Math.max(14 - currentAge, 0)).toISOString().split('T')[0],
      },
      {
        puppy_id: puppyId,
        milestone_type: "health:first_vet_check",
        notes: "Initial veterinary examination",
        milestone_date: addDays(today, Math.max(42 - currentAge, 0)).toISOString().split('T')[0],
      },
      // Behavioral milestones
      {
        puppy_id: puppyId,
        milestone_type: "behavioral:first_walk",
        notes: "First supervised exploration of outdoor environment",
        milestone_date: addDays(today, Math.max(49 - currentAge, 0)).toISOString().split('T')[0],
      },
      {
        puppy_id: puppyId,
        milestone_type: "behavioral:collar_intro",
        notes: "First time wearing collar and being introduced to leash",
        milestone_date: addDays(today, Math.max(56 - currentAge, 0)).toISOString().split('T')[0],
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
      
      // Find the milestone to update its notes properly
      const { data: milestone, error: fetchError } = await supabase
        .from('puppy_milestones')
        .select('*')
        .eq('id', milestoneId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Append completion info to notes
      let updatedNotes = milestone.notes || "";
      if (!updatedNotes.includes('COMPLETED:')) {
        updatedNotes = `${updatedNotes} COMPLETED:${today}`.trim();
      }
      
      // Update the milestone
      const { data, error } = await supabase
        .from('puppy_milestones')
        .update({ notes: updatedNotes })
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
      // Convert UI fields to database fields
      const milestone_type = `${milestoneData.category}:${milestoneData.title.toLowerCase().replace(/ /g, '_')}`;
      
      const { data, error } = await supabase
        .from('puppy_milestones')
        .insert({
          puppy_id: puppyId,
          milestone_type: milestone_type,
          milestone_date: milestoneData.target_date,
          notes: milestoneData.description || ""
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
  const completedMilestones = milestones.filter(milestone => 
    milestone.notes?.includes('COMPLETED:')
  );
  
  const pendingMilestones = milestones.filter(milestone => 
    !milestone.notes?.includes('COMPLETED:')
  );
  
  const overdueMilestones = pendingMilestones.filter(milestone => 
    milestone.milestone_date && isBefore(new Date(milestone.milestone_date), new Date())
  );
  
  const upcomingMilestones = pendingMilestones.filter(milestone => 
    milestone.milestone_date && !isBefore(new Date(milestone.milestone_date), new Date())
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
