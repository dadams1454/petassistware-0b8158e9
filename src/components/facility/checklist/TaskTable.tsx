
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { ChecklistArea, ChecklistTask } from '../types/checklistTypes';

interface TaskTableProps {
  areas: ChecklistArea[];
  toggleTask: (areaIndex: number, taskIndex: number) => void;
  updateInitials: (areaIndex: number, taskIndex: number, value: string) => void;
  onEditTask?: (taskId: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  areas,
  toggleTask,
  updateInitials,
  onEditTask,
}) => {
  return (
    <div className="p-4">
      {areas.map((area, areaIndex) => (
        <div key={area.id} className="mb-6">
          <h2 className="text-xl font-semibold bg-muted p-2 rounded">{area.name}</h2>
          <div className="overflow-x-auto">
            <table className="w-full mt-2">
              <thead>
                <tr className="bg-muted/50">
                  <th className="w-8 p-2 text-left">✓</th>
                  <th className="p-2 text-left">Task</th>
                  <th className="w-20 p-2 text-center">Initials</th>
                  <th className="w-24 p-2 text-center">Time</th>
                  <th className="w-24 p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {area.tasks.map((task, taskIndex) => (
                  <tr key={task.id} className="border-t">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(areaIndex, taskIndex)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-2">{task.name}</td>
                    <td className="p-2">
                      <Input
                        value={task.initials}
                        onChange={(e) => updateInitials(areaIndex, taskIndex, e.target.value)}
                        placeholder="Init."
                        className="w-full p-1 text-center h-8"
                      />
                    </td>
                    <td className="p-2 text-center">{task.completed ? task.time : '—'}</td>
                    <td className="p-2 flex gap-1 justify-center">
                      {onEditTask && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onEditTask(task.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskTable;
