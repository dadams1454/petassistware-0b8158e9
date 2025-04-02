
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, CheckSquare, Clock } from 'lucide-react';
import { Task } from '@/types/task';

const TasksView: React.FC = () => {
  // Example tasks with corrected status values
  const tasks: Task[] = [
    { id: '1', name: 'Clean kennels', description: 'Daily cleaning of all kennels', status: 'in-progress', priority: 'high', due_date: '2023-12-05', created_at: '2023-12-01' },
    { id: '2', name: 'Restock food supplies', description: 'Order new food supplies', status: 'pending', priority: 'medium', due_date: '2023-12-07', created_at: '2023-12-01' },
    { id: '3', name: 'Update vaccination records', description: 'Update all dog vaccination records', status: 'completed', priority: 'high', due_date: '2023-12-03', created_at: '2023-11-28' },
    { id: '4', name: 'Facility inspection', description: 'Prepare for monthly inspection', status: 'pending', priority: 'medium', due_date: '2023-12-15', created_at: '2023-12-01' },
    { id: '5', name: 'Training session', description: 'Group training session for staff', status: 'pending', priority: 'low', due_date: '2023-12-10', created_at: '2023-12-01' }
  ];

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button>Add Task</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Clock className="mr-2 h-5 w-5 text-amber-500" />
              Pending ({pendingTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.map(task => (
              <div key={task.id} className="p-3 bg-muted rounded-md">
                <h3 className="font-medium">{task.name}</h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="flex items-center">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    Due: {task.due_date}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              In Progress ({inProgressTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inProgressTasks.map(task => (
              <div key={task.id} className="p-3 bg-muted rounded-md">
                <h3 className="font-medium">{task.name}</h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="flex items-center">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    Due: {task.due_date}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <CheckSquare className="mr-2 h-5 w-5 text-green-500" />
              Completed ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTasks.map(task => (
              <div key={task.id} className="p-3 bg-muted rounded-md">
                <h3 className="font-medium">{task.name}</h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="flex items-center">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    Completed
                  </span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TasksView;
