
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import HealthIndicatorForm from './HealthIndicatorForm';
import { useHealthIndicators } from '@/hooks/useHealthIndicators';
import { HealthIndicator } from '@/types/health';

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
  
  const handleSave = async (data: any) => {
    await addIndicator(data);
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
          isSubmitting={isAdding}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};

export default HealthIndicatorDialog;
