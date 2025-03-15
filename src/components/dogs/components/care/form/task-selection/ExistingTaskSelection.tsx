
import React from 'react';
import { Plus } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CareTaskPreset } from '@/types/dailyCare';
import CategoryTabs from './CategoryTabs';

interface ExistingTaskSelectionProps {
  form: UseFormReturn<any>;
  presets: CareTaskPreset[];
  selectedCategory: string;
  customTaskName: string;
  showCustomTask: boolean;
  handleCategoryChange: (value: string) => void;
  handleTaskNameChange: (value: string) => void;
  handleCustomTaskChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ExistingTaskSelection: React.FC<ExistingTaskSelectionProps> = ({
  form,
  presets,
  selectedCategory,
  customTaskName,
  showCustomTask,
  handleCategoryChange,
  handleTaskNameChange,
  handleCustomTaskChange,
}) => {
  // Extract unique categories from presets
  const categories = Array.from(new Set(presets.map(preset => preset.category)));
  
  // Filter tasks based on selected category
  const filteredTasks = selectedCategory
    ? presets.filter(preset => preset.category === selectedCategory)
    : [];

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <CategoryTabs 
              categories={categories} 
              selectedCategory={selectedCategory} 
              handleCategoryChange={handleCategoryChange} 
            />
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
  );
};

export default ExistingTaskSelection;
