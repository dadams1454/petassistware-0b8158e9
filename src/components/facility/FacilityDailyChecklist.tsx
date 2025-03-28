
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Plus } from 'lucide-react';
import { useChecklistData } from './checklist/useChecklistData';
import ChecklistHeader from './checklist/ChecklistHeader';
import ChecklistProgress from './checklist/ChecklistProgress';
import TaskTable from './checklist/TaskTable';
import VerificationSection from './checklist/VerificationSection';

interface FacilityDailyChecklistProps {
  onEditTask?: (taskId: string) => void;
}

const FacilityDailyChecklist: React.FC<FacilityDailyChecklistProps> = ({ onEditTask }) => {
  const {
    isLoading,
    areas,
    staffMembers,
    comments,
    setComments,
    completedBy,
    setCompletedBy,
    verifiedBy,
    setVerifiedBy,
    currentDate,
    editMode,
    setEditMode,
    editingAreaId,
    editingTaskId,
    newAreaName,
    newTaskDescription,
    setNewAreaName,
    setNewTaskDescription,
    toggleTask,
    updateTaskStaff,
    updateInitials,
    calculateProgress,
    saveChecklist,
    startEditingArea,
    saveAreaName,
    startEditingTask,
    saveTaskDescription,
    addTask,
    removeTask,
    addArea,
    removeArea,
    resetChecklist,
    getStaffNameById
  } = useChecklistData();
  
  const progress = calculateProgress();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="shadow-md">
        <ChecklistHeader date={currentDate} />
        
        {/* Controls */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setEditMode(!editMode)}
              variant={editMode ? "destructive" : "outline"}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {editMode ? 'Exit Edit Mode' : 'Edit Checklist'}
            </Button>
            {editMode && (
              <Button onClick={addArea} variant="default" className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Area
              </Button>
            )}
          </div>
          <Button
            onClick={resetChecklist}
            variant="outline"
            disabled={editMode}
          >
            Reset Checklist
          </Button>
        </div>
        
        <CardContent className="p-0">
          {/* Progress Bar */}
          <ChecklistProgress 
            completedTasks={progress.completedTasks}
            totalTasks={progress.totalTasks}
            percentage={progress.percentage}
          />
          
          {/* Task Lists by Area */}
          <TaskTable 
            areas={areas} 
            staffMembers={staffMembers}
            editMode={editMode}
            editingAreaId={editingAreaId}
            editingTaskId={editingTaskId}
            newAreaName={newAreaName}
            newTaskDescription={newTaskDescription}
            setNewAreaName={setNewAreaName}
            setNewTaskDescription={setNewTaskDescription}
            toggleTask={toggleTask}
            updateTaskStaff={updateTaskStaff}
            updateInitials={updateInitials}
            startEditingArea={startEditingArea}
            saveAreaName={saveAreaName}
            startEditingTask={startEditingTask}
            saveTaskDescription={saveTaskDescription}
            addTask={addTask}
            removeTask={removeTask}
            removeArea={removeArea}
            getStaffNameById={getStaffNameById}
            onEditTask={onEditTask}
          />
          
          {/* Verification and Comments Sections */}
          <VerificationSection
            completedBy={completedBy}
            setCompletedBy={setCompletedBy}
            verifiedBy={verifiedBy}
            setVerifiedBy={setVerifiedBy}
            comments={comments}
            setComments={setComments}
            onSave={saveChecklist}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityDailyChecklist;
