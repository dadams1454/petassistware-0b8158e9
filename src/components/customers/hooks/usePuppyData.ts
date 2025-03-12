
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Customer, Puppy } from '../types/customer';

export const usePuppyData = (customers: Customer[]) => {
  const [puppiesData, setPuppiesData] = useState<Record<string, Puppy>>({});

  useEffect(() => {
    const fetchPuppies = async () => {
      const puppyIds = customers
        .map(customer => customer.metadata?.interested_puppy_id)
        .filter(id => id) as string[];
      
      if (puppyIds.length === 0) return;
      
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .in('id', puppyIds);
      
      if (error) {
        toast({
          title: "Error fetching puppies",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      const puppiesRecord: Record<string, Puppy> = {};
      data?.forEach(puppy => {
        puppiesRecord[puppy.id] = puppy;
      });
      
      setPuppiesData(puppiesRecord);
    };
    
    fetchPuppies();
  }, [customers]);

  return puppiesData;
};
