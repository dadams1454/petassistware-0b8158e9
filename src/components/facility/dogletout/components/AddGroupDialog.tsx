
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newGroupName: string;
  onGroupNameChange: (name: string) => void;
  newGroupColor: string;
  onGroupColorChange: (color: string) => void;
  onAddGroup: () => void;
}

const AddGroupDialog: React.FC<AddGroupDialogProps> = ({
  open,
  onOpenChange,
  newGroupName,
  onGroupNameChange,
  newGroupColor,
  onGroupColorChange,
  onAddGroup
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Dog Group</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="group-name" className="text-right">
              Group Name
            </label>
            <Input
              id="group-name"
              value={newGroupName}
              onChange={(e) => onGroupNameChange(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="group-color" className="text-right">
              Group Color
            </label>
            <div className="col-span-3 flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full border" 
                style={{ backgroundColor: newGroupColor }}
              />
              <input
                id="group-color"
                type="color"
                value={newGroupColor}
                onChange={(e) => onGroupColorChange(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddGroup}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupDialog;
