
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
      
      // Check if we need to add default presets
      const needsExercisePresets = !data.some(preset => preset.category === 'exercise');
      const needsMedicationPresets = !data.some(preset => preset.category === 'medications');
      
      if (needsExercisePresets || needsMedicationPresets) {
        try {
          // Add exercise presets if needed
          if (needsExercisePresets) {
            console.log('No exercise presets found, adding defaults...');
            await addCareTaskPreset('exercise', 'Walk', true);
            await addCareTaskPreset('exercise', 'Play fetch', true);
            await addCareTaskPreset('exercise', 'Run', true);
            await addCareTaskPreset('exercise', 'Swim', true);
            await addCareTaskPreset('exercise', 'Training session', true);
          }
          
          // Add medication presets if needed  
          if (needsMedicationPresets) {
            console.log('No medication presets found, adding defaults...');
            await addCareTaskPreset('medications', 'Heartworm Prevention', true);
            await addCareTaskPreset('medications', 'Flea/Tick Prevention', true);
            await addCareTaskPreset('medications', 'Dewormer', true);
            await addCareTaskPreset('medications', 'Antibiotics', true);
            await addCareTaskPreset('medications', 'Pain Medication', true);
            await addCareTaskPreset('medications', 'Eye Medication', true);
            await addCareTaskPreset('medications', 'Ear Medication', true);
          }
          
          // Fetch again after adding defaults
          const updatedData = await fetchCareTaskPresets();
          setPresets(updatedData);
        } catch (error) {
          console.error('Error adding default presets:', error);
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
      const result = await addCareTaskPreset(newCategoryName.trim(), newTaskName.trim(), false);
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
