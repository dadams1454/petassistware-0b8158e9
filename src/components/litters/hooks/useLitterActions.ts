
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Litter } from '../puppies/types';

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

  // Helper function to get the litter to delete from state
  const getLitterToDelete = async (): Promise<Litter | null> => {
    return new Promise(resolve => {
      // Just retrieve the current value without setting it
      const currentValue = setLitterToDelete(state => {
        return state;
      });
      resolve(currentValue);
    });
  };

  return {
    handleDeleteLitter,
    handleArchiveLitter,
    handleUnarchiveLitter
  };
};

export default useLitterActions;
