
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface DogGroupFormDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  groupName: string;
  setGroupName: (name: string) => void;
  groupDescription: string;
  setGroupDescription: (description: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  handleSaveGroup: () => void;
  isLoading: boolean;
  editingGroup: any | null;
}

const DogGroupFormDialog: React.FC<DogGroupFormDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  groupName,
  setGroupName,
  groupDescription,
  setGroupDescription,
  selectedColor,
  setSelectedColor,
  handleSaveGroup,
  isLoading,
  editingGroup
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingGroup ? 'Edit Dog Group' : 'Create Dog Group'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Small Dogs, Kennels 1-4, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Dogs that can be let out together"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Group Color</Label>
            <Select
              value={selectedColor}
              onValueChange={setSelectedColor}
            >
              <SelectTrigger id="color">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="teal">Teal</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveGroup}
            disabled={!groupName.trim() || isLoading}
          >
            {isLoading ? 'Saving...' : editingGroup ? 'Update Group' : 'Create Group'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DogGroupFormDialog;
