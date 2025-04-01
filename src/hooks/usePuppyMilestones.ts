
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { addDays } from 'date-fns';

export const usePuppyMilestones = (puppyId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Common milestones for puppies
  const defaultMilestones = [
    {
      title: 'Eyes Open',
      description: 'Puppies typically open their eyes between 10-14 days of age',
      category: 'physical',
      expected_age_days: 14
    },
    {
      title: 'Ears Open',
      description: 'Puppies begin to hear sounds around 14-18 days of age',
      category: 'physical',
      expected_age_days: 18
    },
    {
      title: 'First Steps',
      description: 'Puppies begin to stand and take first steps',
      category: 'physical',
      expected_age_days: 21
    },
    {
      title: 'First Vaccination',
      description: 'First core vaccination typically given at 6-8 weeks',
      category: 'health',
      expected_age_days: 42
    },
    {
      title: 'Deworming',
      description: 'First deworming treatment',
      category: 'health',
      expected_age_days: 14
    },
    {
      title: 'Microchipping',
      description: 'Permanent identification with microchip',
      category: 'health',
      expected_age_days: 56
    },
    {
      title: 'First Bark',
      description: 'Puppy makes first bark sounds',
      category: 'behavioral',
      expected_age_days: 21
    },
    {
      title: 'Begin Socialization',
      description: 'Start introducing puppy to new experiences',
      category: 'behavioral',
      expected_age_days: 28
    },
    {
      title: 'Begin Weaning',
      description: 'Start the transition from nursing to solid food',
      category: 'physical',
      expected_age_days: 28
    }
  ];
  
  // Fetch puppy milestones
  const { 
    data: milestones, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['puppyMilestones', puppyId],
    queryFn: async () => {
      if (!puppyId) return [];
      
      // First fetch the puppy to get birth date
      const { data: puppy, error: puppyError } = await supabase
        .from('puppies')
        .select(`
          id, birth_date, 
          litter:litter_id(birth_date)
        `)
        .eq('id', puppyId)
        .single();
      
      if (puppyError) throw puppyError;
      
      const birthDate = puppy.birth_date || puppy.litter?.birth_date;
      
      // Then fetch existing milestones
      const { data: existingMilestones, error } = await supabase
        .from('puppy_milestones')
        .select('*')
        .eq('puppy_id', puppyId);
      
      if (error) throw error;
      
      // If no milestones exist yet and we have a birth date, create default ones
      if (existingMilestones.length === 0 && birthDate) {
        const milestoneRecords = defaultMilestones.map(milestone => {
          // Calculate target date from birth date and expected age
          const targetDate = addDays(new Date(birthDate), milestone.expected_age_days);
          
          return {
            puppy_id: puppyId,
            title: milestone.title,
            description: milestone.description,
            category: milestone.category,
            expected_age_days: milestone.expected_age_days,
            target_date: targetDate.toISOString().split('T')[0],
          };
        });
        
        // Insert default milestones
        const { data: insertedMilestones, error: insertError } = await supabase
          .from('puppy_milestones')
          .insert(milestoneRecords)
          .select();
        
        if (insertError) throw insertError;
        
        return insertedMilestones || [];
      }
      
      return existingMilestones || [];
    },
    enabled: !!puppyId
  });
  
  // Add milestone
  const addMilestone = useMutation({
    mutationFn: async (milestone: any) => {
      const { data, error } = await supabase
        .from('puppy_milestones')
        .insert(milestone)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppyMilestones', puppyId] });
      toast({
        title: 'Milestone added',
        description: 'The milestone has been added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding milestone',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Mark milestone as complete
  const markComplete = useMutation({
    mutationFn: async (milestoneId: string) => {
      const { data, error } = await supabase
        .from('puppy_milestones')
        .update({ 
          completion_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', milestoneId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppyMilestones', puppyId] });
      toast({
        title: 'Milestone completed',
        description: 'The milestone has been marked as complete',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error completing milestone',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Filter milestones into different categories
  const completedMilestones = milestones?.filter(m => m.completion_date) || [];
  
  const incompleteMilestones = milestones?.filter(m => !m.completion_date) || [];
  
  // Get the current date
  const today = new Date();
  
  // Calculate upcoming and overdue milestones
  const upcomingMilestones = incompleteMilestones.filter(m => {
    if (!m.target_date) return false;
    const targetDate = new Date(m.target_date);
    return targetDate >= today;
  });
  
  const overdueMilestones = incompleteMilestones.filter(m => {
    if (!m.target_date) return false;
    const targetDate = new Date(m.target_date);
    return targetDate < today;
  });
  
  return {
    milestones: milestones || [],
    completedMilestones,
    upcomingMilestones,
    overdueMilestones,
    isLoading,
    error,
    addMilestone: addMilestone.mutate,
    markComplete: markComplete.mutate
  };
};
