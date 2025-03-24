
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpItem } from '../types/followUp';
import { WaitlistEntry } from '@/components/waitlist/types';

export const useFollowUps = () => {
  return useQuery({
    queryKey: ['follow-ups'],
    queryFn: async () => {
      const { data: waitlistEntries, error } = await supabase
        .from('waitlist')
        .select('*, customers(*)')
        .eq('status', 'contacted')
        .order('contacted_at', { ascending: false });
      
      if (error) throw error;
      
      const followUps = (waitlistEntries as unknown as WaitlistEntry[]).map(entry => ({
        id: `followup-${entry.id}`,
        type: 'waitlist' as const,
        customer_id: entry.customer_id,
        due_date: entry.contacted_at ? 
          new Date(new Date(entry.contacted_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : 
          new Date().toISOString(),
        status: 'pending' as const,
        notes: `Follow up on waitlist request for ${entry.customers.first_name} ${entry.customers.last_name}`,
        reference_id: entry.id,
        created_at: entry.contacted_at || entry.requested_at,
        customer: entry.customers
      }));
      
      return followUps as FollowUpItem[];
    }
  });
};

