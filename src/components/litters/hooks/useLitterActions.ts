import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Litter } from '@/types/litter';

export const useLitterActions = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteLitter = async (litterId: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('litters')
        .delete()
        .eq('id', litterId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success!',
        description: 'Litter deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteLitter = (litter: Litter) => {
    toast({
      title: 'Delete Litter?',
      description: `Are you sure you want to delete ${litter.litter_name}? This action cannot be undone.`,
      action: {
        label: 'Delete',
        onClick: () => deleteLitter(litter.id),
      },
    });
  };

  return {
    isDeleting,
    deleteLitter,
    handleDeleteLitter
  };
};
