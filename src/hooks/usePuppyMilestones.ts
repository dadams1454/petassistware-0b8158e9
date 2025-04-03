
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { PuppyMilestone } from '@/types/puppyTracking';
import { differenceInDays } from 'date-fns';

interface UsePuppyMilestonesProps {
  puppyId: string;
}

export const usePuppyMilestones = (puppyId: string) => {
  const [milestones, setMilestones] = useState<PuppyMilestone[]>([]);
  const [completedMilestones, setCompletedMilestones] = useState<PuppyMilestone[]>([]);
  const [upcomingMilestones, setUpcomingMilestones] = useState<PuppyMilestone[]>([]);
  const [overdueMilestones, setOverdueMilestones] = useState<PuppyMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!puppyId) return;
    fetchMilestones();
  }, [puppyId]);

  const fetchMilestones = async () => {
    setIsLoading(true);
    try {
      // Get puppy birth date first for age calculations
      const { data: puppyData, error: puppyError } = await supabase
        .from('puppies')
        .select('birth_date')
        .eq('id', puppyId)
        .single();

      if (puppyError) throw puppyError;
      
      const birthDate = puppyData?.birth_date;
      if (!birthDate) throw new Error('Puppy birth date not found');

      const { data, error } = await supabase
        .from('puppy_developmental_milestones')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('expected_age_days', { ascending: true });

      if (error) throw error;

      const currentDate = new Date();
      const puppyBirthDate = new Date(birthDate);
      const puppyAgeInDays = differenceInDays(currentDate, puppyBirthDate);

      // Process milestones into categories
      const allMilestones = data as PuppyMilestone[];
      
      const completed = allMilestones.filter(m => m.completion_date);
      
      const upcoming = allMilestones.filter(
        m => !m.completion_date && 
        (m.expected_age_days ?? 0) > puppyAgeInDays
      );
      
      const overdue = allMilestones.filter(
        m => !m.completion_date && 
        (m.expected_age_days ?? 0) <= puppyAgeInDays
      );

      setMilestones(allMilestones);
      setCompletedMilestones(completed);
      setUpcomingMilestones(upcoming);
      setOverdueMilestones(overdue);
    } catch (err) {
      console.error('Error fetching puppy milestones:', err);
      setError(err instanceof Error ? err : new Error('An error occurred fetching milestones'));
    } finally {
      setIsLoading(false);
    }
  };

  const addMilestone = async (milestoneData: Partial<PuppyMilestone>) => {
    try {
      const { data, error } = await supabase
        .from('puppy_developmental_milestones')
        .insert({
          ...milestoneData,
          puppy_id: puppyId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Milestone added',
        description: 'New developmental milestone has been added successfully.',
      });

      await fetchMilestones();
      return data;
    } catch (err) {
      console.error('Error adding puppy milestone:', err);
      toast({
        title: 'Error',
        description: 'Failed to add milestone. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const markComplete = async (milestoneId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('puppy_developmental_milestones')
        .update({
          completion_date: today,
          is_completed: true,
        })
        .eq('id', milestoneId);

      if (error) throw error;

      toast({
        title: 'Milestone completed',
        description: 'Milestone has been marked as completed.',
      });

      await fetchMilestones();
    } catch (err) {
      console.error('Error completing milestone:', err);
      toast({
        title: 'Error',
        description: 'Failed to mark milestone as complete.',
        variant: 'destructive',
      });
    }
  };

  const deleteMilestone = async (milestoneId: string) => {
    try {
      const { error } = await supabase
        .from('puppy_developmental_milestones')
        .delete()
        .eq('id', milestoneId);

      if (error) throw error;

      toast({
        title: 'Milestone deleted',
        description: 'The milestone has been deleted successfully.',
      });

      await fetchMilestones();
    } catch (err) {
      console.error('Error deleting milestone:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete milestone.',
        variant: 'destructive',
      });
    }
  };

  return {
    milestones,
    completedMilestones,
    upcomingMilestones,
    overdueMilestones,
    isLoading,
    error,
    addMilestone,
    markComplete,
    deleteMilestone,
    refreshMilestones: fetchMilestones,
  };
};
