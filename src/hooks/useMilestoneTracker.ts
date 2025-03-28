
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Milestone, MilestoneType } from '@/components/litters/puppies/milestones/types';

export const useMilestoneTracker = (puppyId: string) => {
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch milestones for this puppy
  const { 
    data: milestones,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['puppy-milestones', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puppy_milestones')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('milestone_date', { ascending: true });
      
      if (error) throw error;
      return data as Milestone[];
    }
  });

  const addMilestone = async (milestone: {
    milestone_type: MilestoneType;
    milestone_date: Date;
    notes?: string;
  }) => {
    setIsSubmitting(true);
    try {
      // Check if this milestone type already exists
      if (milestones && milestones.length > 0) {
        const existingMilestone = milestones.find(m => 
          m.milestone_type === milestone.milestone_type && 
          milestone.milestone_type !== 'custom'
        );
        
        if (existingMilestone) {
          toast({
            title: "Milestone already exists",
            description: "This milestone has already been recorded. You can delete it first if you want to update it.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return null;
        }
      }
      
      // Insert new milestone
      const { data, error } = await supabase
        .from('puppy_milestones')
        .insert({
          puppy_id: puppyId,
          ...milestone
        })
        .select();
      
      if (error) throw error;
      
      // If this is a standard milestone, update the puppy record as well
      if (milestone.milestone_type !== 'custom') {
        const milestoneFieldMap: Record<string, string> = {
          'eyes_open': 'eyes_open_date',
          'ears_open': 'ears_open_date',
          'first_walk': 'first_walk_date',
          'full_mobility': 'fully_mobile_date'
        };
        
        const fieldToUpdate = milestoneFieldMap[milestone.milestone_type];
        
        if (fieldToUpdate) {
          const dateStr = milestone.milestone_date.toISOString().split('T')[0];
          
          await supabase
            .from('puppies')
            .update({ [fieldToUpdate]: dateStr })
            .eq('id', puppyId);
        }
      }
      
      toast({
        title: "Milestone recorded",
        description: "The developmental milestone has been saved successfully."
      });
      
      refetch();
      return data[0] as Milestone;
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the milestone.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMilestone = async (milestoneId: string) => {
    try {
      // Find the milestone to check its type
      const milestone = milestones?.find(m => m.id === milestoneId);
      if (!milestone) return;
      
      // Delete the milestone
      const { error } = await supabase
        .from('puppy_milestones')
        .delete()
        .eq('id', milestoneId);
      
      if (error) throw error;
      
      // If this was a standard milestone, also clear the field in the puppy record
      if (milestone.milestone_type !== 'custom') {
        const milestoneFieldMap: Record<string, string> = {
          'eyes_open': 'eyes_open_date',
          'ears_open': 'ears_open_date',
          'first_walk': 'first_walk_date',
          'full_mobility': 'fully_mobile_date'
        };
        
        const fieldToClear = milestoneFieldMap[milestone.milestone_type];
        
        if (fieldToClear) {
          await supabase
            .from('puppies')
            .update({ [fieldToClear]: null })
            .eq('id', puppyId);
        }
      }
      
      toast({
        title: "Milestone deleted",
        description: "The developmental milestone has been deleted successfully."
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: "Error",
        description: "There was a problem deleting the milestone.",
        variant: "destructive"
      });
    }
  };

  return {
    milestones,
    isLoading,
    isAddingMilestone,
    setIsAddingMilestone,
    isSubmitting,
    addMilestone,
    deleteMilestone,
    refetchMilestones: refetch
  };
};
