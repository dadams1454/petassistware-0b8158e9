
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ToastAction } from '@/components/ui/toast';
import { Litter } from '@/types/litter';

export const useLitterActions = (
  onRefresh: () => Promise<any>,
  setLitterToDelete: React.Dispatch<React.SetStateAction<Litter | null>>
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  
  const handleDeleteLitter = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      try {
        // Assume litterToDelete is set when this is called
        const { error } = await supabase
          .from('litters')
          .delete()
          .eq('id', setLitterToDelete as any);

        if (error) throw error;
        
        toast({
          title: "Litter deleted",
          description: "The litter has been removed successfully",
          action: <ToastAction altText="Close">Close</ToastAction>
        });
        
        await onRefresh();
        setLitterToDelete(null);
      } catch (error) {
        console.error('Error deleting litter:', error);
        toast({
          title: "Error",
          description: "There was a problem deleting the litter",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleArchiveLitter = async (litter: Litter) => {
    if (!isArchiving) {
      setIsArchiving(true);
      try {
        const { error } = await supabase
          .from('litters')
          .update({ status: 'archived' })
          .eq('id', litter.id);

        if (error) throw error;
        
        toast({
          title: "Litter archived",
          description: "The litter has been archived successfully",
          action: <ToastAction altText="Close">Close</ToastAction>
        });
        
        await onRefresh();
      } catch (error) {
        console.error('Error archiving litter:', error);
        toast({
          title: "Error",
          description: "There was a problem archiving the litter",
          variant: "destructive",
        });
      } finally {
        setIsArchiving(false);
      }
    }
  };

  const handleUnarchiveLitter = async (litter: Litter) => {
    if (!isArchiving) {
      setIsArchiving(true);
      try {
        const { error } = await supabase
          .from('litters')
          .update({ status: 'active' })
          .eq('id', litter.id);

        if (error) throw error;
        
        toast({
          title: "Litter activated",
          description: "The litter has been reactivated successfully",
          action: <ToastAction altText="Close">Close</ToastAction>
        });
        
        await onRefresh();
      } catch (error) {
        console.error('Error activating litter:', error);
        toast({
          title: "Error",
          description: "There was a problem activating the litter",
          variant: "destructive",
        });
      } finally {
        setIsArchiving(false);
      }
    }
  };

  return {
    isDeleting,
    isArchiving,
    handleDeleteLitter,
    handleArchiveLitter,
    handleUnarchiveLitter
  };
};
