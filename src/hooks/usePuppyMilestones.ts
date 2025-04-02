
import { useState, useEffect, useCallback, useMemo } from 'react';
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

  const markComplete = useCallback(async (milestoneId: string) => {
    try {
      const { data, error } = await supabase
        .from('puppy_milestones')
        .update({
          is_completed: true,
          completion_date: new Date().toISOString()
        })
        .eq('id', milestoneId)
        .select()
        .single();
      
      if (error) throw error;
      
      setMilestones(prev => 
        prev.map(m => m.id === milestoneId ? data : m)
      );
      
      return data;
    } catch (err) {
      console.error('Error marking milestone as complete:', err);
      throw err;
    }
  }, []);

  // Compute derived milestone lists
  const completedMilestones = useMemo(() => {
    return milestones.filter(m => m.is_completed);
  }, [milestones]);
  
  const upcomingMilestones = useMemo(() => {
    const today = new Date();
    const currentAgeDays = puppyBirthDate 
      ? Math.floor((today.getTime() - new Date(puppyBirthDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
      
    return milestones.filter(m => 
      !m.is_completed && 
      m.expected_age_days >= currentAgeDays
    ).sort((a, b) => a.expected_age_days - b.expected_age_days);
  }, [milestones, puppyBirthDate]);
  
  const overdueMilestones = useMemo(() => {
    const today = new Date();
    const currentAgeDays = puppyBirthDate 
      ? Math.floor((today.getTime() - new Date(puppyBirthDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
      
    return milestones.filter(m => 
      !m.is_completed && 
      m.expected_age_days < currentAgeDays
    ).sort((a, b) => b.expected_age_days - a.expected_age_days);
  }, [milestones, puppyBirthDate]);

  useEffect(() => {
    if (puppyId) {
      fetchMilestones();
    }
  }, [puppyId, fetchMilestones]);

  return {
    milestones,
    completedMilestones,
    upcomingMilestones,
    overdueMilestones,
    isLoading,
    error,
    addMilestone,
    deleteMilestone,
    markComplete,
    puppyBirthDate,
    refreshMilestones: fetchMilestones
  };
}
