
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

// Import the refactored form components
import TaskSelection from './form/TaskSelection';
import DateTimeSelector from './form/DateTimeSelector';
import NotesField from './form/NotesField';
import FlagSelection from './form/FlagSelection';
import { useCareLogForm } from './form/useCareLogForm';

interface CareLogFormProps {
  dogId: string;
  onSuccess?: () => void;
}

const CareLogForm: React.FC<CareLogFormProps> = ({ dogId, onSuccess }) => {
  const {
    form,
    loading,
    presets,
    selectedCategory,
    customTaskName,
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
  } = useCareLogForm(dogId, onSuccess);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Log Daily Care</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TaskSelection
              form={form}
              presets={presets}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
              customTaskName={customTaskName}
              setCustomTaskName={setCustomTaskName}
              showCustomTask={showCustomTask}
              setShowCustomTask={setShowCustomTask}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              showNewPresetDialog={showNewPresetDialog}
              setShowNewPresetDialog={setShowNewPresetDialog}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              newTaskName={newTaskName}
              setNewTaskName={setNewTaskName}
              handleCategoryChange={handleCategoryChange}
              handleTaskNameChange={handleTaskNameChange}
              handleCustomTaskChange={handleCustomTaskChange}
              handleAddPreset={handleAddPreset}
              loading={loading}
            />

            <DateTimeSelector form={form} />

            <NotesField form={form} />

            <FlagSelection 
              selectedFlags={selectedFlags}
              toggleFlag={toggleFlag}
              otherDogs={otherDogs}
              incompatibleDogs={incompatibleDogs}
              handleIncompatibleDogToggle={handleIncompatibleDogToggle}
              specialAttentionNote={specialAttentionNote}
              setSpecialAttentionNote={setSpecialAttentionNote}
              otherFlagNote={otherFlagNote}
              setOtherFlagNote={setOtherFlagNote}
              showFlagsSection={showFlagsSection}
              setShowFlagsSection={setShowFlagsSection}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              Log Care Task
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CareLogForm;
