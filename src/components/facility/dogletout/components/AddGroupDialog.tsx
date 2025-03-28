
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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create New Dog Group</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-3">
          <div className="grid grid-cols-4 items-center gap-3">
            <label htmlFor="group-name" className="text-right text-sm">
              Group Name
            </label>
            <Input
              id="group-name"
              value={newGroupName}
              onChange={(e) => onGroupNameChange(e.target.value)}
              className="col-span-3 h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <label htmlFor="group-color" className="text-right text-sm">
              Group Color
            </label>
            <div className="col-span-3 flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full border" 
                style={{ backgroundColor: newGroupColor }}
              />
              <input
                id="group-color"
                type="color"
                value={newGroupColor}
                onChange={(e) => onGroupColorChange(e.target.value)}
                className="w-full h-8"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={onAddGroup}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupDialog;
