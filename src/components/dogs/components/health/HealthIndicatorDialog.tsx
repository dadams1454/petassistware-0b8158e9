
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import HealthIndicatorForm from './HealthIndicatorForm';
import { useHealthIndicators } from '@/hooks/useHealthIndicators';

interface HealthIndicatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
}

const HealthIndicatorDialog: React.FC<HealthIndicatorDialogProps> = ({
  open,
  onOpenChange,
  dogId
}) => {
  const { addIndicator, isAdding } = useHealthIndicators(dogId);
  
  const handleSave = (data: any) => {
    addIndicator(data);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Record Health Indicators
          </DialogTitle>
        </DialogHeader>
        
        <HealthIndicatorForm 
          dogId={dogId}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isAdding}
        />
      </DialogContent>
    </Dialog>
  );
};

export default HealthIndicatorDialog;
