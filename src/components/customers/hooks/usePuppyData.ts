
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Puppy } from '@/components/litters/puppies/types';

export const usePuppyData = (litterId?: string) => {
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!litterId) return;
    
    const fetchPuppies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('puppies')
          .select('*')
          .eq('litter_id', litterId)
          .eq('status', 'Available');
          
        if (error) throw error;
        
        setPuppies(data as Puppy[]);
      } catch (err: any) {
        console.error('Error fetching available puppies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPuppies();
  }, [litterId]);

  return { puppies, loading, error };
};
