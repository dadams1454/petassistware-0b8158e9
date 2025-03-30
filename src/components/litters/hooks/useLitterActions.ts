
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Litter } from '@/types/litter';

export const useLitterActions = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isUnarchiving, setIsUnarchiving] = useState(false);
  const navigate = useNavigate();

  const handleDeleteLitter = async (litter: Litter) => {
    if (!litter.id) return;
    
    setIsDeleting(true);
    
    try {
      // Delete the litter
      const { error } = await supabase
        .from('litters')
        .delete()
        .eq('id', litter.id);
      
      if (error) throw error;
      
      toast({
        title: 'Litter Deleted',
        description: `Litter "${litter.litter_name || 'Unnamed'}" has been deleted.`,
        variant: 'default',
        action: <button onClick={() => navigate('/litters')}>View Litters</button>
      });
      
    } catch (error: any) {
      console.error('Error deleting litter:', error);
      toast({
        title: 'Error',
        description: `Failed to delete litter: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchiveLitter = async (litter: Litter) => {
    if (!litter.id) return;
    
    setIsArchiving(true);
    
    try {
      // Archive the litter by setting status to 'archived'
      const { error } = await supabase
        .from('litters')
        .update({ status: 'archived' })
        .eq('id', litter.id);
      
      if (error) throw error;
      
      toast({
        title: 'Litter Archived',
        description: `Litter "${litter.litter_name || 'Unnamed'}" has been archived.`,
        variant: 'default',
        action: <button onClick={() => navigate('/litters')}>View Litters</button>
      });
      
    } catch (error: any) {
      console.error('Error archiving litter:', error);
      toast({
        title: 'Error',
        description: `Failed to archive litter: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleUnarchiveLitter = async (litter: Litter) => {
    if (!litter.id) return;
    
    setIsUnarchiving(true);
    
    try {
      // Unarchive the litter by setting status to 'active'
      const { error } = await supabase
        .from('litters')
        .update({ status: 'active' })
        .eq('id', litter.id);
      
      if (error) throw error;
      
      toast({
        title: 'Litter Unarchived',
        description: `Litter "${litter.litter_name || 'Unnamed'}" has been unarchived.`,
        variant: 'default',
        action: <button onClick={() => navigate('/litters')}>View Litters</button>
      });
      
    } catch (error: any) {
      console.error('Error unarchiving litter:', error);
      toast({
        title: 'Error',
        description: `Failed to unarchive litter: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setIsUnarchiving(false);
    }
  };
  
  return {
    isDeleting,
    isArchiving,
    isUnarchiving,
    handleDeleteLitter,
    handleArchiveLitter,
    handleUnarchiveLitter
  };
};

export default useLitterActions;
