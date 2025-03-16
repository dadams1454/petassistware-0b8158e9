
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDailyCare } from '@/contexts/dailyCare';
import { CareTaskPreset } from '@/types/dailyCare';
import { CareLogFormValues } from './useCareLogFormState';

interface UseTaskHandlingProps {
  form: UseFormReturn<CareLogFormValues>;
  setSelectedCategory: (value: string) => void;
  setShowCustomTask: (value: boolean) => void;
  customTaskName: string;
  newCategoryName: string;
  newTaskName: string;
  setShowNewPresetDialog: (value: boolean) => void;
  setActiveTab: (value: string) => void;
}

export const useTaskHandling = ({
  form,
  setSelectedCategory,
  setShowCustomTask,
  customTaskName,
  newCategoryName,
  newTaskName,
  setShowNewPresetDialog,
  setActiveTab
}: UseTaskHandlingProps) => {
  const { fetchCareTaskPresets, addCareTaskPreset } = useDailyCare();
  const [presets, setPresets] = useState<CareTaskPreset[]>([]);

  useEffect(() => {
    const loadPresets = async () => {
      const data = await fetchCareTaskPresets();
      
      // If we don't have any exercise presets, let's add some default ones
      if (!data.some(preset => preset.category === 'exercise')) {
        console.log('No exercise presets found, adding defaults...');
        try {
          await addCareTaskPreset('exercise', 'Walk');
          await addCareTaskPreset('exercise', 'Play fetch');
          await addCareTaskPreset('exercise', 'Run');
          await addCareTaskPreset('exercise', 'Swim');
          await addCareTaskPreset('exercise', 'Training session');
          
          // Fetch again after adding defaults
          const updatedData = await fetchCareTaskPresets();
          setPresets(updatedData);
        } catch (error) {
          console.error('Error adding default exercise presets:', error);
          setPresets(data);
        }
      } else {
        setPresets(data);
      }
    };
    
    loadPresets();
  }, [fetchCareTaskPresets, addCareTaskPreset]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue('category', value);
    // Reset task when category changes
    form.setValue('task_name', '');
    setShowCustomTask(false);
  };

  const handleTaskNameChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomTask(true);
      form.setValue('task_name', '');
    } else {
      form.setValue('task_name', value);
      setShowCustomTask(false);
    }
  };

  const handleCustomTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('task_name', e.target.value);
  };

  const handleAddPreset = async () => {
    if (newCategoryName.trim() && newTaskName.trim()) {
      const result = await addCareTaskPreset(newCategoryName.trim(), newTaskName.trim());
      if (result) {
        // Refresh presets
        const updatedPresets = await fetchCareTaskPresets();
        setPresets(updatedPresets);
        
        // Select the new category and task
        form.setValue('category', newCategoryName.trim());
        form.setValue('task_name', newTaskName.trim());
        setSelectedCategory(newCategoryName.trim());
        
        // Clear inputs and close dialog
        setShowNewPresetDialog(false);
        setActiveTab('existing');
      }
    }
  };

  return {
    presets,
    handleCategoryChange,
    handleTaskNameChange,
    handleCustomTaskChange,
    handleAddPreset
  };
};
