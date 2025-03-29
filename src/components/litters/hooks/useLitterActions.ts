
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Litter } from '@/types/litter';

const useLitterActions = (
  onRefresh: () => Promise<any>,
  setLitterToDelete: React.Dispatch<React.SetStateAction<Litter | null>>
) => {
  const handleDeleteLitter = async () => {
    try {
      const litterToDelete = await getLitterToDelete();
      if (!litterToDelete) return;
      
      const { error } = await supabase
        .from('litters')
        .delete()
        .eq('id', litterToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "Litter deleted",
        description: "The litter has been successfully deleted.",
      });
      
      setLitterToDelete(null);
      await onRefresh();
    } catch (error) {
      console.error('Error deleting litter:', error);
      toast({
        title: "Error",
        description: "There was an error deleting the litter.",
        variant: "destructive",
      });
    }
  };

  const handleArchiveLitter = async (litter: Litter) => {
    try {
      const { error } = await supabase
        .from('litters')
        .update({ status: 'archived' })
        .eq('id', litter.id);
      
      if (error) throw error;
      
      toast({
        title: "Litter archived",
        description: "The litter has been successfully archived.",
      });
      
      await onRefresh();
    } catch (error) {
      console.error('Error archiving litter:', error);
      toast({
        title: "Error",
        description: "There was an error archiving the litter.",
        variant: "destructive",
      });
    }
  };

  const handleUnarchiveLitter = async (litter: Litter) => {
    try {
      const { error } = await supabase
        .from('litters')
        .update({ status: 'active' })
        .eq('id', litter.id);
      
      if (error) throw error;
      
      toast({
        title: "Litter unarchived",
        description: "The litter has been successfully unarchived.",
      });
      
      await onRefresh();
    } catch (error) {
      console.error('Error unarchiving litter:', error);
      toast({
        title: "Error",
        description: "There was an error unarchiving the litter.",
        variant: "destructive",
      });
    }
  };

  // Fixed - now correctly returns a Promise<Litter | null> instead of void
  const getLitterToDelete = (): Promise<Litter | null> => {
    return new Promise(resolve => {
      setLitterToDelete(state => {
        resolve(state);
        return state;
      });
    });
  };

  return {
    handleDeleteLitter,
    handleArchiveLitter,
    handleUnarchiveLitter
  };
};

export default useLitterActions;
