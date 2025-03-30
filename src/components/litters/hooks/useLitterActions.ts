
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Litter } from '@/types/litter';

const useLitterActions = (
  onRefresh: () => Promise<any>,
  setLitterToDelete: (litter: Litter | null) => void
) => {
  const [isActionInProgress, setIsActionInProgress] = useState(false);

  const handleDeleteLitter = async () => {
    setIsActionInProgress(true);
    try {
      // The litterToDelete is set in the state of the parent component
      await supabase
        .from('litters')
        .delete()
        .eq('id', setLitterToDelete);
      
      toast({
        title: "Litter deleted",
        description: "The litter has been successfully deleted.",
      });
      
      onRefresh();
      setLitterToDelete(null);
    } catch (error) {
      console.error('Error deleting litter:', error);
      toast({
        title: "Error",
        description: "There was a problem deleting the litter.",
        variant: "destructive",
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleArchiveLitter = async (litter: Litter) => {
    setIsActionInProgress(true);
    try {
      await supabase
        .from('litters')
        .update({ status: 'archived' })
        .eq('id', litter.id);
      
      toast({
        title: "Litter archived",
        description: "The litter has been archived successfully.",
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error archiving litter:', error);
      toast({
        title: "Error",
        description: "There was a problem archiving the litter.",
        variant: "destructive",
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleUnarchiveLitter = async (litter: Litter) => {
    setIsActionInProgress(true);
    try {
      await supabase
        .from('litters')
        .update({ status: 'active' })
        .eq('id', litter.id);
      
      toast({
        title: "Litter activated",
        description: "The litter has been restored to active status.",
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error unarchiving litter:', error);
      toast({
        title: "Error",
        description: "There was a problem activating the litter.",
        variant: "destructive",
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  return {
    isActionInProgress,
    handleDeleteLitter,
    handleArchiveLitter,
    handleUnarchiveLitter,
  };
};

export default useLitterActions;
