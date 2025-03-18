
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '../../types/customer';

interface PuppyLitterDataProps {
  customer: Customer;
  children: (data: { puppy: any | null; litter: any | null }) => React.ReactNode;
}

const PuppyLitterData: React.FC<PuppyLitterDataProps> = ({ customer, children }) => {
  // Fetch puppy details if customer is interested in one
  const { data: puppy } = useQuery({
    queryKey: ['puppy', customer?.metadata?.interested_puppy_id],
    queryFn: async () => {
      if (!customer?.metadata?.interested_puppy_id) return null;
      
      const { data, error } = await supabase
        .from('puppies')
        .select('*, litters(litter_name)')
        .eq('id', customer.metadata.interested_puppy_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!customer?.metadata?.interested_puppy_id
  });
  
  // Fetch litter details if customer is interested in one
  const { data: litter } = useQuery({
    queryKey: ['litter', customer?.metadata?.interested_litter_id],
    queryFn: async () => {
      if (!customer?.metadata?.interested_litter_id) return null;
      
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dogs!litters_dam_id_fkey(name, breed),
          sire:dogs!litters_sire_id_fkey(name, breed)
        `)
        .eq('id', customer.metadata.interested_litter_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!customer?.metadata?.interested_litter_id
  });

  return <>{children({ puppy, litter })}</>;
};

export default PuppyLitterData;
