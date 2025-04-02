
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PuppyMilestone } from '@/types/puppyTracking';

export function usePuppyMilestones(puppyId: string) {
  const [milestones, setMilestones] = useState<PuppyMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [puppyBirthDate, setPuppyBirthDate] = useState<string | null>(null);

  const fetchMilestones = useCallback(async () => {
    if (!puppyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch the puppy's birth date
      const { data: puppyData, error: puppyError } = await supabase
        .from('puppies')
        .select('birth_date')
        .eq('id', puppyId)
        .single();
      
      if (puppyError) throw puppyError;
      
      if (puppyData) {
        setPuppyBirthDate(puppyData.birth_date);
      }
      
      // Fetch the puppy's milestones
      const { data, error: milestonesError } = await supabase
        .from('puppy_milestones')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('milestone_date', { ascending: false });
      
      if (milestonesError) throw milestonesError;
      
      setMilestones(data || []);
    } catch (err) {
      console.error('Error fetching puppy milestones:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [puppyId]);

  const addMilestone = useCallback(async (milestone: Omit<PuppyMilestone, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('puppy_milestones')
        .insert(milestone)
        .select()
        .single();
      
      if (error) throw error;
      
      setMilestones(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding puppy milestone:', err);
      throw err;
    }
  }, []);

  const deleteMilestone = useCallback(async (milestoneId: string) => {
    try {
      const { error } = await supabase
        .from('puppy_milestones')
        .delete()
        .eq('id', milestoneId);
      
      if (error) throw error;
      
      setMilestones(prev => prev.filter(m => m.id !== milestoneId));
      return true;
    } catch (err) {
      console.error('Error deleting puppy milestone:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (puppyId) {
      fetchMilestones();
    }
  }, [puppyId, fetchMilestones]);

  return {
    milestones,
    isLoading,
    error,
    addMilestone,
    deleteMilestone,
    puppyBirthDate,
    refreshMilestones: fetchMilestones
  };
}
