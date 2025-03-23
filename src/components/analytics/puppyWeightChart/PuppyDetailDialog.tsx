
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WeightData } from './types';

interface PuppyDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPuppy: WeightData | null;
}

const PuppyDetailDialog: React.FC<PuppyDetailDialogProps> = ({
  open,
  onOpenChange,
  selectedPuppy
}) => {
  if (!selectedPuppy) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Puppy Weight Details</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-2 mb-4">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: selectedPuppy.color || '#888' }}
            />
            <h3 className="text-lg font-medium">{selectedPuppy.name}</h3>
            {selectedPuppy.gender && (
              <span className="px-2 py-1 text-xs rounded-full bg-muted">
                {selectedPuppy.gender}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Birth Weight</p>
              <p className="text-lg font-medium">
                {selectedPuppy.birthWeight.toFixed(1)} oz
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Weight</p>
              <p className="text-lg font-medium">
                {selectedPuppy.weight.toFixed(1)} oz
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Weight Gain</p>
            <p className="text-lg font-medium">
              {(selectedPuppy.weight - selectedPuppy.birthWeight).toFixed(1)} oz
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedPuppy.litterAverage && (
                <>Litter Average: {selectedPuppy.litterAverage.toFixed(1)} oz</>
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PuppyDetailDialog;
