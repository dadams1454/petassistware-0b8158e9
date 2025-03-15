
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CareTaskPreset } from '@/types/dailyCare';
import TaskSelectionTabs from './task-selection/TaskSelectionTabs';
import ExistingTaskSelection from './task-selection/ExistingTaskSelection';
import NewTaskDialog from './task-selection/NewTaskDialog';

interface TaskSelectionProps {
  form: UseFormReturn<any>;
  presets: CareTaskPreset[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  customTaskName: string;
  setCustomTaskName?: (name: string) => void;
  showCustomTask: boolean;
  setShowCustomTask: (show: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showNewPresetDialog: boolean;
  setShowNewPresetDialog: (show: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  newTaskName: string;
  setNewTaskName: (name: string) => void;
  handleCategoryChange: (value: string) => void;
  handleTaskNameChange: (value: string) => void;
  handleCustomTaskChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddPreset: () => Promise<void>;
  loading: boolean;
}

const TaskSelection: React.FC<TaskSelectionProps> = ({
  form,
  presets,
  selectedCategory,
  customTaskName,
  showCustomTask,
  activeTab,
  setActiveTab,
  showNewPresetDialog,
  setShowNewPresetDialog,
  newCategoryName,
  setNewCategoryName,
  newTaskName,
  setNewTaskName,
  handleCategoryChange,
  handleTaskNameChange,
  handleCustomTaskChange,
  handleAddPreset,
  loading
}) => {
  return (
    <div className="space-y-4">
      <TaskSelectionTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {activeTab === 'existing' ? (
        <ExistingTaskSelection
          form={form}
          presets={presets}
          selectedCategory={selectedCategory}
          customTaskName={customTaskName}
          showCustomTask={showCustomTask}
          handleCategoryChange={handleCategoryChange}
          handleTaskNameChange={handleTaskNameChange}
          handleCustomTaskChange={handleCustomTaskChange}
        />
      ) : (
        <div className="space-y-4">
          <NewTaskDialog
            showNewPresetDialog={showNewPresetDialog}
            setShowNewPresetDialog={setShowNewPresetDialog}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            newTaskName={newTaskName}
            setNewTaskName={setNewTaskName}
            handleAddPreset={handleAddPreset}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default TaskSelection;
