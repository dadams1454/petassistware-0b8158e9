
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DogCareStatus } from '@/types/dailyCare';
import FacilityTaskDialog from '@/components/facility/FacilityTaskDialog';
import FacilityDailyChecklist from '@/components/facility/FacilityDailyChecklist';
import FacilityTabHeader from '@/components/facility/FacilityTabHeader';
import TasksView from '@/components/facility/TasksView';
import { useFacilityData } from '@/components/facility/hooks/useFacilityData';

interface FacilityTabProps {
  onRefreshData: () => void;
  dogStatuses?: DogCareStatus[];
}

const FacilityTab: React.FC<FacilityTabProps> = ({ onRefreshData, dogStatuses }) => {
  const { 
    areas,
    filteredTasks,
    isLoading,
    isTaskDialogOpen,
    setIsTaskDialogOpen,
    searchQuery,
    setSearchQuery,
    selectedFrequency,
    setSelectedFrequency,
    selectedTaskId,
    currentView,
    setCurrentView,
    handleAddTask,
    handleEditTask,
    handleTaskSaved,
    refetchTasks
  } = useFacilityData();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <FacilityTabHeader 
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        
        {currentView === 'tasks' && (
          <TasksView
            filteredTasks={filteredTasks}
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedFrequency={selectedFrequency}
            setSelectedFrequency={setSelectedFrequency}
            handleAddTask={handleAddTask}
            handleEditTask={handleEditTask}
            refetchTasks={refetchTasks}
          />
        )}
      </div>
      
      {currentView === 'checklist' && (
        <FacilityDailyChecklist onEditTask={handleEditTask} />
      )}
      
      {/* Add/Edit Task Dialog */}
      <Dialog 
        open={isTaskDialogOpen} 
        onOpenChange={setIsTaskDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTaskId ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
          </DialogHeader>
          
          <FacilityTaskDialog
            taskId={selectedTaskId}
            areas={areas || []}
            onSuccess={handleTaskSaved}
            onCancel={() => setIsTaskDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacilityTab;
