
import { supabase } from '@/integrations/supabase/client';

export const usePuppyStatusUpdate = () => {
  /**
   * Updates the status of puppies when customer puppy interest changes
   * @param previousPuppyId ID of previously interested puppy or null
   * @param newPuppyId ID of newly interested puppy or null
   */
  const updatePuppyStatuses = async (
    previousPuppyId: string | null, 
    newPuppyId: string | null
  ) => {
    // Determine if the puppy interest changed
    const puppyInterestChanged = previousPuppyId !== newPuppyId;
    
    if (!puppyInterestChanged) {
      console.log("No change in puppy interest, skipping puppy status updates");
      return;
    }
    
    console.log("Puppy interest changed:", { from: previousPuppyId, to: newPuppyId });
    
    // If there was a previous puppy, set it back to Available
    if (previousPuppyId) {
      console.log("Resetting previous puppy status for:", previousPuppyId);
      const { error: resetError } = await supabase
        .from('puppies')
        .update({ status: 'Available' })
        .eq('id', previousPuppyId);
      
      if (resetError) {
        console.error("Error resetting previous puppy status:", resetError);
      }
    }
    
    // If a new puppy is selected, set it to Reserved
    if (newPuppyId) {
      console.log("Updating new puppy status to Reserved for:", newPuppyId);
      const { error: reserveError } = await supabase
        .from('puppies')
        .update({ 
          status: 'Reserved',
          reservation_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', newPuppyId);
      
      if (reserveError) {
        console.error("Error updating puppy status:", reserveError);
      }
    }
  };
  
  return { updatePuppyStatuses };
};
