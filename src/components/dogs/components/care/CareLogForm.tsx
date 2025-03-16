
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import TaskSelection from './form/TaskSelection';
import DateTimeSelector from './form/DateTimeSelector';
import NotesField from './form/NotesField';
import FlagSelection from './form/FlagSelection';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCareLogForm } from './form/useCareLogForm';

interface CareLogFormProps {
  dogId: string;
  onSuccess?: () => void;
  initialCategory?: string;
}

const CareLogForm: React.FC<CareLogFormProps> = ({ dogId, onSuccess, initialCategory }) => {
  const {
    form,
    loading,
    presets,
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
  } = useCareLogForm({ dogId, onSuccess, initialCategory });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Log Care Activity</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <TaskSelection 
            form={form}
            presets={presets}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            customTaskName={customTaskName}
            setCustomTaskName={setCustomTaskName}
            showCustomTask={showCustomTask}
            setShowCustomTask={setShowCustomTask}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            newTaskName={newTaskName}
            setNewTaskName={setNewTaskName}
            showNewPresetDialog={showNewPresetDialog}
            setShowNewPresetDialog={setShowNewPresetDialog}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleCategoryChange={handleCategoryChange}
            handleTaskNameChange={handleTaskNameChange}
            handleCustomTaskChange={handleCustomTaskChange}
            handleAddPreset={handleAddPreset}
            loading={loading}
          />

          <DateTimeSelector form={form} />
          
          <NotesField form={form} />
          
          <FlagSelection
            showFlagsSection={showFlagsSection}
            setShowFlagsSection={setShowFlagsSection}
            selectedFlags={selectedFlags}
            toggleFlag={toggleFlag}
            otherDogs={otherDogs}
            incompatibleDogs={incompatibleDogs}
            handleIncompatibleDogToggle={handleIncompatibleDogToggle}
            specialAttentionNote={specialAttentionNote}
            setSpecialAttentionNote={setSpecialAttentionNote}
            otherFlagNote={otherFlagNote}
            setOtherFlagNote={setOtherFlagNote}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CareLogForm;
