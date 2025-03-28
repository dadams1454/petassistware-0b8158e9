
import React from 'react';
import { FacilityTask } from '@/types/facility';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: FacilityTask[];
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  getBadgeColor: (frequency: string) => string;
  getFrequencyLabel: (frequency: string, customDays: number[] | null) => string;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onComplete,
  getBadgeColor,
  getFrequencyLabel
}) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
          getBadgeColor={getBadgeColor}
          getFrequencyLabel={getFrequencyLabel}
        />
      ))}
    </div>
  );
};

export default TaskList;
