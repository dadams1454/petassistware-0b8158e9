import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Task } from "@/types/task"

// Mock task data
const mockTasks: Task[] = [
  { id: "1", title: "Clean Kennel A", description: "Thoroughly clean and disinfect Kennel A.", status: "In Progress", priority: "High", category: "Cleaning" },
  { id: "2", title: "Check Food Supplies", description: "Verify and replenish food supplies for all kennels.", status: "To Do", priority: "Medium", category: "Feeding" },
  { id: "3", title: "Administer Medication", description: "Administer daily medication to dogs in medical care.", status: "Completed", priority: "High", category: "Medical" },
  { id: "4", title: "Exercise Dogs", description: "Take dogs for their scheduled exercise routines.", status: "To Do", priority: "Medium", category: "Care" },
  { id: "5", title: "Inspect Kennels", description: "Inspect all kennels for safety and maintenance issues.", status: "To Do", priority: "Low", category: "Maintenance" },
];

// Update the component props to include onEditTask
interface TasksViewProps {
  onEditTask?: (taskId: string) => void;
}

const TasksView: React.FC<TasksViewProps> = ({ onEditTask }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 pr-2">
        <ScrollArea className="h-[500px] w-full rounded-md border">
          <TaskList onEditTask={onEditTask} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Update TaskList component to accept onEditTask prop
interface TaskListProps {
  onEditTask?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  return (
    <div className="relative">
      {tasks.map((task) => (
        <div key={task.id} className="grid grid-cols-4 gap-4 py-3 border-b last:border-b-0">
          <div className="col-span-3">
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-muted-foreground">{task.description}</div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <div className="text-sm font-medium leading-none">{task.priority}</div>
            <p className="text-sm text-muted-foreground">
              {task.status}
            </p>
            <button onClick={() => onEditTask?.(task.id)} className="text-sm text-blue-500">Edit</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasksView;
