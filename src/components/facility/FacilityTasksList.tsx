
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { FacilityTask } from '@/types/facility';
import TaskList from './components/TaskList';
import { useTaskUtils } from './hooks/useTaskUtils';
import { useTaskActions } from './hooks/useTaskActions';

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
  const { getFrequencyLabel, getBadgeColor, handleCompleteTask } = useTaskUtils();
  const { handleDeleteTask } = useTaskActions(onRefresh);
  
  return (
    <TaskList
      tasks={tasks}
      onEdit={onEdit}
      onDelete={handleDeleteTask}
      onComplete={handleCompleteTask}
      getBadgeColor={getBadgeColor}
      getFrequencyLabel={getFrequencyLabel}
    />
  );
};

export default FacilityTasksList;
