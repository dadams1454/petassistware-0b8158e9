
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { SocializationRecord, SocializationCategory } from '@/components/litters/puppies/socialization/types';

export const useSocializationTracker = (puppyId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch socialization records for this puppy
  const { 
    data: experiences,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['socialization-records', puppyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('socialization_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('experience_date', { ascending: false });
      
      if (error) throw error;
      return data as SocializationRecord[];
    }
  });

  const addExperience = async (record: {
    puppy_id: string;
    category: SocializationCategory;
    experience: string;
    experience_date: Date;
    reaction?: string;
    notes?: string;
  }) => {
    setIsSubmitting(true);
    try {
      // Convert Date to string if it's a Date object
      const dateString = typeof record.experience_date === 'string' 
        ? record.experience_date 
        : record.experience_date.toISOString().split('T')[0];
      
      // Insert new experience record
      const { data, error } = await supabase
        .from('socialization_records')
        .insert({
          puppy_id: record.puppy_id,
          category: record.category,
          experience: record.experience,
          experience_date: dateString,
          reaction: record.reaction,
          notes: record.notes
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Experience recorded",
        description: "The socialization experience has been saved successfully."
      });
      
      refetch();
      return data[0] as SocializationRecord;
    } catch (error) {
      console.error('Error adding socialization record:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the socialization record.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExperience = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('socialization_records')
        .delete()
        .eq('id', recordId);
      
      if (error) throw error;
      
      toast({
        title: "Experience deleted",
        description: "The socialization record has been deleted successfully."
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting socialization record:', error);
      toast({
        title: "Error",
        description: "There was a problem deleting the socialization record.",
        variant: "destructive"
      });
    }
  };

  return {
    experiences,
    isLoading,
    isSubmitting,
    addExperience,
    deleteExperience
  };
};
