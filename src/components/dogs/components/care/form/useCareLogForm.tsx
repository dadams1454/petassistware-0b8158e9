
import { useState, useEffect } from 'react';
import { useCareLogFormState, CareLogFormValues } from './hooks/useCareLogFormState';
import { useTaskHandling } from './hooks/useTaskHandling';
import { useFlagHandling } from './hooks/useFlagHandling';
import { useFormSubmission } from './hooks/useFormSubmission';

interface UseCareLogFormProps {
  dogId: string;
  onSuccess?: () => void;
  initialCategory?: string;
}

export const useCareLogForm = ({ dogId, onSuccess, initialCategory }: UseCareLogFormProps) => {
  // Get form state and handlers from our custom hooks
  const formState = useCareLogFormState();
  
  const {
    form,
    selectedCategory,
    setSelectedCategory,
    customTaskName,
    setCustomTaskName,
    showCustomTask,
    setShowCustomTask,
    newCategoryName,
    setNewCategoryName,
    newTaskName,
    setNewTaskName,
    showNewPresetDialog,
    setShowNewPresetDialog,
    activeTab,
    setActiveTab,
    otherDogs,
    setOtherDogs,
    incompatibleDogs,
    setIncompatibleDogs,
    showFlagsSection,
    setShowFlagsSection,
    selectedFlags,
    setSelectedFlags,
    specialAttentionNote,
    setSpecialAttentionNote,
    otherFlagNote,
    setOtherFlagNote
  } = formState;

  // Set initial category if provided
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory, setSelectedCategory]);

  // Task handling
  const taskHandling = useTaskHandling({
    form,
    setSelectedCategory,
    setShowCustomTask,
    customTaskName,
    newCategoryName,
    newTaskName,
    setShowNewPresetDialog,
    setActiveTab
  });

  const {
    presets,
    handleCategoryChange,
    handleTaskNameChange,
    handleCustomTaskChange,
    handleAddPreset
  } = taskHandling;

  // Flag handling
  const flagHandling = useFlagHandling({
    dogId,
    setOtherDogs,
    incompatibleDogs,
    setIncompatibleDogs,
    selectedFlags,
    setSelectedFlags,
    specialAttentionNote,
    otherFlagNote
  });

  const {
    handleIncompatibleDogToggle,
    toggleFlag,
    compileFlags
  } = flagHandling;

  // Form submission
  const { loading, submitCareLog } = useFormSubmission({ dogId, onSuccess });

  // Submit handler that combines all the parts
  const onSubmit = async (values: CareLogFormValues) => {
    // Compile flags from UI state
    const flags = compileFlags();
    
    const success = await submitCareLog(values, flags);
    
    if (success && onSuccess) {
      form.reset();
      onSuccess();
    }
  };

  // Return everything needed by the form component
  return {
    form,
    loading,
    presets,
    selectedCategory,
    setSelectedCategory,
    customTaskName,
    setCustomTaskName,
    newCategoryName,
    setNewCategoryName,
    newTaskName,
    setNewTaskName,
    showCustomTask,
    setShowCustomTask,
    activeTab,
    setActiveTab,
    showNewPresetDialog,
    setShowNewPresetDialog,
    otherDogs,
    incompatibleDogs,
    showFlagsSection,
    setShowFlagsSection,
    selectedFlags,
    specialAttentionNote,
    setSpecialAttentionNote,
    otherFlagNote,
    setOtherFlagNote,
    handleCategoryChange,
    handleTaskNameChange,
    handleCustomTaskChange,
    handleAddPreset,
    handleIncompatibleDogToggle,
    toggleFlag,
    onSubmit
  };
};
