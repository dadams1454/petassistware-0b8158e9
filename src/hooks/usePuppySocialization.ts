
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SocializationExperience, SocializationProgress } from '@/types/puppyTracking';

export const usePuppySocialization = (puppyId: string) => {
  const [experiences, setExperiences] = useState<SocializationExperience[]>([]);
  const [progressStats, setProgressStats] = useState<SocializationProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (puppyId) {
      fetchExperiences();
    }
  }, [puppyId]);

  const fetchExperiences = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('socialization_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('experience_date', { ascending: false });

      if (error) throw error;

      setExperiences(data as SocializationExperience[]);
      calculateProgress(data as SocializationExperience[]);
    } catch (err) {
      console.error('Error fetching socialization experiences:', err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching socialization data');
      toast({
        title: 'Error',
        description: 'Could not load socialization records',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = (experiences: SocializationExperience[]) => {
    // Define the target categories and counts
    const targets = [
      { category: 'people', categoryName: 'People', target: 10 },
      { category: 'animals', categoryName: 'Animals', target: 5 },
      { category: 'environments', categoryName: 'Environments', target: 8 },
      { category: 'sounds', categoryName: 'Sounds', target: 6 },
      { category: 'handling', categoryName: 'Handling', target: 7 },
      { category: 'surfaces', categoryName: 'Surfaces', target: 5 },
      { category: 'objects', categoryName: 'Objects', target: 8 },
    ];

    // Count experiences by category
    const categoryCounts = experiences.reduce((acc, exp) => {
      const category = exp.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate progress for each category
    const progress: SocializationProgress[] = targets.map(target => {
      const count = categoryCounts[target.category] || 0;
      const completion_percentage = Math.min(Math.round((count / target.target) * 100), 100);
      return {
        category: target.category,
        categoryName: target.categoryName,
        count,
        target: target.target,
        completion_percentage
      };
    });

    // Calculate overall progress
    const totalExperiences = experiences.length;
    const totalTargets = targets.reduce((sum, t) => sum + t.target, 0);
    const overallPercentage = Math.min(Math.round((totalExperiences / totalTargets) * 100), 100);

    setProgressStats(progress);
    setOverallProgress(overallPercentage);
  };

  const addExperience = async (experienceData: Partial<SocializationExperience>) => {
    try {
      const { data, error } = await supabase
        .from('socialization_records')
        .insert({
          ...experienceData,
          puppy_id: puppyId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Experience added',
        description: 'The socialization experience has been recorded successfully.'
      });

      // Update the local state
      const newExperience = data as SocializationExperience;
      setExperiences(prev => [newExperience, ...prev]);
      calculateProgress([...experiences, newExperience]);
      
      return newExperience;
    } catch (err) {
      console.error('Error adding socialization record:', err);
      toast({
        title: 'Error',
        description: 'Failed to add socialization experience.',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('socialization_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Experience deleted',
        description: 'The socialization experience has been removed.'
      });

      // Update the local state
      const updatedExperiences = experiences.filter(exp => exp.id !== id);
      setExperiences(updatedExperiences);
      calculateProgress(updatedExperiences);
    } catch (err) {
      console.error('Error deleting socialization record:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete socialization experience.',
        variant: 'destructive'
      });
    }
  };

  return {
    experiences,
    progressStats,
    overallProgress,
    isLoading,
    error,
    addExperience,
    deleteExperience,
    refreshExperiences: fetchExperiences
  };
};
