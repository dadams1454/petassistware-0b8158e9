
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MoreHorizontal, ClipboardCheck } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FacilityTask {
  id: string;
  name: string;
  description: string | null;
  frequency: string;
  area_id: string | null;
  custom_days: number[] | null;
  active: boolean;
  assigned_to: string | null;
  last_generated: string | null;
  next_due: string | null;
  facility_areas: {
    id: string;
    name: string;
    description: string | null;
  } | null;
}

interface FacilityTasksListProps {
  tasks: FacilityTask[];
  onEdit: (taskId: string) => void;
  onRefresh: () => void;
}

const FacilityTasksList: React.FC<FacilityTasksListProps> = ({ 
  tasks, 
  onEdit,
  onRefresh
}) => {
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

  const handleDeleteTask = async (taskId: string) => {
    try {
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
    }
  };
  
  const handleCompleteTask = (taskId: string) => {
    // This will be implemented in a future update
    toast({
      title: 'Coming Soon',
      description: 'Task completion functionality will be available in the next update.'
    });
  };
  
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {task.name}
                </CardTitle>
                <Badge className={`font-normal ${getBadgeColor(task.frequency)}`}>
                  {getFrequencyLabel(task.frequency, task.custom_days)}
                </Badge>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Task actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Complete Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(task.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="pb-4">
            <div className="space-y-2">
              {task.description && (
                <p className="text-sm text-muted-foreground">{task.description}</p>
              )}
              
              {task.facility_areas && (
                <div className="text-sm">
                  <span className="font-medium">Area:</span> {task.facility_areas.name}
                </div>
              )}
              
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Complete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FacilityTasksList;
