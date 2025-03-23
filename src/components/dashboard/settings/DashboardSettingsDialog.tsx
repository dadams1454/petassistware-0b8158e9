
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DashboardSettings from './DashboardSettings';

interface DashboardSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DashboardSettingsDialog = ({
  open,
  onOpenChange,
}: DashboardSettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
          <DialogDescription>
            Customize your dashboard by configuring which widgets are visible and how they're displayed.
          </DialogDescription>
        </DialogHeader>
        
        <DashboardSettings onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default DashboardSettingsDialog;
