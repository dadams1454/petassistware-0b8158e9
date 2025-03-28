
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useTaskActions = (onRefresh: () => void) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('facility_tasks')
        .update({ active: false })
        .eq('id', taskId);
      
      if (error) throw error;
      
      toast({
        title: 'Task deleted',
        description: 'The task has been removed successfully.',
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    isDeleting,
    handleDeleteTask
  };
};
