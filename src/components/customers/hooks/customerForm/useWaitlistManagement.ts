
import { supabase } from '@/integrations/supabase/client';

export const useWaitlistManagement = () => {
  /**
   * Adds a customer to the waitlist if applicable
   * @param customerId ID of the customer to add to waitlist
   * @param waitlistType Type of waitlist (specific or open)
   * @param litterId ID of specific litter or null for open waitlist
   */
  const addToWaitlist = async (
    customerId: string,
    waitlistType: 'specific' | 'open',
    litterId: string | null
  ) => {
    // Only add to waitlist if customer selected a waitlist type
    if (waitlistType !== 'open' && !litterId) {
      console.log("No waitlist selected, skipping waitlist management");
      return;
    }
    
    // Check if already on waitlist for this litter
    const { data: existingEntries, error: checkError } = await supabase
      .from('waitlist')
      .select('id')
      .eq('customer_id', customerId)
      .eq('litter_id', waitlistType === 'open' ? null : litterId);
    
    if (checkError) {
      console.error("Error checking waitlist:", checkError);
      return;
    }
    
    // Only add to waitlist if not already on it
    if (!existingEntries || existingEntries.length === 0) {
      console.log("Adding to waitlist:", waitlistType, "Litter ID:", litterId);
      
      const waitlistEntry = {
        customer_id: customerId,
        litter_id: waitlistType === 'open' ? null : litterId,
        status: 'pending',
        notes: `Added via customer form - ${waitlistType === 'open' ? 'Open waitlist' : 'Specific litter interest'}`,
        preferences: {}
      };
      
      const { error: waitlistError } = await supabase
        .from('waitlist')
        .insert(waitlistEntry);
      
      if (waitlistError) {
        console.error("Error adding to waitlist:", waitlistError);
      } else {
        console.log("Successfully added to waitlist");
      }
    } else {
      console.log("Customer already on this waitlist, skipping");
    }
  };
  
  return { addToWaitlist };
};
