
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChecklistArea } from '../types/checklistTypes';
import { FacilityStaff } from '@/types/facility';

interface TaskTableProps {
  areas: ChecklistArea[];
  staffMembers: FacilityStaff[];
  editMode: boolean;
  editingAreaId: string | null;
  editingTaskId: string | null;
  newAreaName: string;
  newTaskDescription: string;
  setNewAreaName: (name: string) => void;
  setNewTaskDescription: (description: string) => void;
  toggleTask: (areaIndex: number, taskIndex: number) => void;
  updateTaskStaff: (areaIndex: number, taskIndex: number, staffId: string | null) => void;
  updateInitials: (areaIndex: number, taskIndex: number, initials: string) => void;
  startEditingArea: (areaId: string, currentName: string) => void;
  saveAreaName: (areaIndex: number) => void;
  startEditingTask: (taskId: string, currentDescription: string) => void;
  saveTaskDescription: (areaIndex: number, taskIndex: number) => void;
  addTask: (areaIndex: number) => void;
  removeTask: (areaIndex: number, taskIndex: number) => void;
  removeArea: (areaIndex: number) => void;
  getStaffNameById: (staffId: string | null) => string;
  onEditTask?: (taskId: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  areas,
  staffMembers,
  editMode,
  editingAreaId,
  editingTaskId,
  newAreaName,
  newTaskDescription,
  setNewAreaName,
  setNewTaskDescription,
  toggleTask,
  updateTaskStaff,
  updateInitials,
  startEditingArea,
  saveAreaName,
  startEditingTask,
  saveTaskDescription,
  addTask,
  removeTask,
  removeArea,
  getStaffNameById,
  onEditTask
}) => {
  const activeStaff = staffMembers.filter(staff => staff.active);
  
  return (
    <div className="p-4">
      {areas.map((area, areaIndex) => (
        <div key={area.id} className="mb-6">
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
            {editingAreaId === area.id ? (
              <div className="flex items-center w-full">
                <input 
                  type="text" 
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  className="p-1 border rounded flex-grow"
                />
                <Button 
                  onClick={() => saveAreaName(areaIndex)}
                  variant="default"
                  size="sm"
                  className="ml-2"
                >
                  Save
                </Button>
                <Button 
                  onClick={() => startEditingArea(area.id, area.name)}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{area.name}</h2>
                {editMode && (
                  <div>
                    <Button 
                      onClick={() => startEditingArea(area.id, area.name)}
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button 
                      onClick={() => addTask(areaIndex)}
                      variant="default"
                      size="sm"
                      className="mr-2"
                    >
                      Add Task
                    </Button>
                    <Button 
                      onClick={() => removeArea(areaIndex)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
          
          <table className="w-full mt-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-8 p-2 text-left">✓</th>
                <th className="p-2 text-left">Task</th>
                <th className="w-32 p-2 text-center">Staff</th>
                <th className="w-24 p-2 text-center">Time</th>
                {editMode && <th className="w-24 p-2 text-center">Actions</th>}
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
                      disabled={editMode}
                    />
                  </td>
                  <td className="p-2">
                    {editingTaskId === task.id ? (
                      <div className="flex items-center">
                        <input 
                          type="text" 
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                          className="p-1 border rounded flex-grow"
                        />
                        <Button 
                          onClick={() => saveTaskDescription(areaIndex, taskIndex)}
                          variant="default"
                          size="sm"
                          className="ml-2"
                        >
                          Save
                        </Button>
                        <Button 
                          onClick={() => startEditingTask(task.id, task.name)}
                          variant="outline"
                          size="sm"
                          className="ml-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className={task.completed ? "line-through text-gray-500" : ""}>
                          {task.name}
                        </span>
                        {editMode && (
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => startEditingTask(task.id, task.name)}
                              variant="outline"
                              size="sm"
                            >
                              Edit
                            </Button>
                            {onEditTask && (
                              <Button
                                onClick={() => onEditTask(task.id)}
                                variant="outline"
                                size="sm"
                              >
                                Advanced
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    {!editMode && task.completed ? (
                      <select
                        value={task.staffId || ''}
                        onChange={(e) => updateTaskStaff(areaIndex, taskIndex, e.target.value || null)}
                        className="w-full p-1 border rounded text-center"
                      >
                        <option value="">Select Staff</option>
                        {activeStaff.map(staff => (
                          <option key={staff.id} value={staff.id}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{getStaffNameById(task.staffId)}</span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    {task.completed ? (
                      <div className="flex flex-col items-center gap-1">
                        {task.time}
                        {!editMode && (
                          <input
                            type="text"
                            value={task.initials}
                            onChange={(e) => updateInitials(areaIndex, taskIndex, e.target.value)}
                            className="w-12 p-1 border rounded text-center text-xs"
                            placeholder="Init."
                            maxLength={3}
                          />
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  {editMode && (
                    <td className="p-2 text-center">
                      <Button 
                        onClick={() => removeTask(areaIndex, taskIndex)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
              {area.tasks.length === 0 && (
                <tr>
                  <td colSpan={editMode ? 5 : 4} className="p-4 text-center text-gray-500">
                    No tasks in this area. {editMode && "Click 'Add Task' to add one."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TaskTable;
