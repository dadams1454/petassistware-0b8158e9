
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SocializationCategory, SocializationRecord } from '@/components/litters/puppies/types';
import { useToast } from './use-toast';

export const useSocializationTracker = (puppyId: string) => {
  const [experiences, setExperiences] = useState<SocializationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchExperiences = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('socialization_records')
        .select('*')
        .eq('puppy_id', puppyId);

      if (error) throw error;

      // Type conversion for database records to application type
      const typedData = data.map(record => ({
        ...record,
        category: record.category as unknown as SocializationCategory,
      }));

      setExperiences(typedData as SocializationRecord[]);
    } catch (err: any) {
      console.error('Error fetching socialization records:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Could not load socialization records',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async (experience: {
    category: SocializationCategory;
    experience: string;
    experience_date: string;
    reaction?: string;
    notes?: string;
  }) => {
    try {
      const { error, data } = await supabase
        .from('socialization_records')
        .insert({
          puppy_id: puppyId,
          category: experience.category as unknown as string,
          experience: experience.experience,
          experience_date: experience.experience_date,
          reaction: experience.reaction || '',
          notes: experience.notes || '',
        })
        .select()
        .single();

      if (error) throw error;

      // Convert the returned data to our application type
      const newRecord = {
        ...data,
        category: data.category as unknown as SocializationCategory,
      } as SocializationRecord;

      setExperiences(prev => [...prev, newRecord]);
      
      toast({
        title: 'Success',
        description: 'Socialization experience recorded',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error adding socialization record:', err);
      toast({
        title: 'Error',
        description: err.message || 'Could not add socialization record',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (puppyId) {
      fetchExperiences();
    }
  }, [puppyId]);

  return { 
    experiences, 
    loading, 
    error, 
    addExperience, 
    refreshExperiences: fetchExperiences 
  };
};
