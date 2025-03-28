
import { useToast } from '@/components/ui/use-toast';

export const useTaskUtils = () => {
  const { toast } = useToast();
  
  const getFrequencyLabel = (frequency: string, customDays: number[] | null) => {
    switch(frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'custom':
        if (customDays && customDays.length > 0) {
          return `Every ${customDays.join(', ')} days`;
        }
        return 'Custom';
      default:
        return frequency;
    }
  };
  
  const getBadgeColor = (frequency: string) => {
    switch(frequency) {
      case 'daily':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
      case 'weekly':
        return 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300';
      case 'monthly':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300';
      case 'quarterly':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300';
      case 'custom':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
      default:
        return '';
    }
  };
  
  const handleCompleteTask = (taskId: string) => {
    toast({
      title: 'Coming Soon',
      description: 'Task completion functionality will be available in the next update.'
    });
  };
  
  return {
    getFrequencyLabel,
    getBadgeColor,
    handleCompleteTask
  };
};
