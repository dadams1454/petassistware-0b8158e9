
import React from 'react';
import { Plus } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface NewTaskDialogProps {
  showNewPresetDialog: boolean;
  setShowNewPresetDialog: (show: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  newTaskName: string;
  setNewTaskName: (name: string) => void;
  handleAddPreset: () => Promise<void>;
  loading: boolean;
}

const NewTaskDialog: React.FC<NewTaskDialogProps> = ({
  showNewPresetDialog,
  setShowNewPresetDialog,
  newCategoryName,
  setNewCategoryName,
  newTaskName,
  setNewTaskName,
  handleAddPreset,
  loading
}) => {
  return (
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
  );
};

export default NewTaskDialog;
