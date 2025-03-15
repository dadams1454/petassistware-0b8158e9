
import React from 'react';
import { Plus } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { UseFormReturn } from 'react-hook-form';
import { CareTaskPreset } from '@/types/dailyCare';

interface TaskSelectionProps {
  form: UseFormReturn<any>;
  presets: CareTaskPreset[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  customTaskName: string;
  // We'll modify this to be optional with a ? mark
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
  // Extract unique categories from presets
  const categories = Array.from(new Set(presets.map(preset => preset.category)));
  
  // Filter tasks based on selected category
  const filteredTasks = selectedCategory
    ? presets.filter(preset => preset.category === selectedCategory)
    : [];

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button
          type="button"
          className={`px-3 py-1 text-sm rounded-md ${activeTab === 'existing' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'}`}
          onClick={() => setActiveTab('existing')}
        >
          Use Existing Task
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-sm rounded-md ${activeTab === 'new' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'}`}
          onClick={() => setActiveTab('new')}
        >
          Create New Task
        </button>
      </div>
      
      {activeTab === 'existing' ? (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => handleCategoryChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedCategory && (
            <FormField
              control={form.control}
              name="task_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task</FormLabel>
                  <Select
                    value={field.value || ''}
                    onValueChange={handleTaskNameChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a task" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredTasks.map(task => (
                        <SelectItem key={task.id} value={task.task_name}>
                          {task.task_name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">
                        <span className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Custom Task
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {showCustomTask && (
            <FormItem>
              <FormLabel>Custom Task</FormLabel>
              <Input
                placeholder="Enter custom task name"
                value={customTaskName}
                onChange={handleCustomTaskChange}
              />
            </FormItem>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Dialog open={showNewPresetDialog} onOpenChange={setShowNewPresetDialog}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Task Preset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task Preset</DialogTitle>
                <DialogDescription>
                  Add a new task preset that can be reused for daily care logs.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <FormLabel>Category</FormLabel>
                  <Input
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <FormLabel>Task Name</FormLabel>
                  <Input
                    placeholder="Enter task name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleAddPreset} disabled={loading}>
                  Save Preset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default TaskSelection;
