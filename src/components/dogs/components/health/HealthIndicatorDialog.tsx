
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
  const { 
    addHealthIndicator, 
    isSubmitting 
  } = useHealthIndicators(dogId);
  
  const handleSave = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        dog_id: dogId,
        date: data.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        abnormal: !!data.abnormal,
        alert_generated: false,  // We'll handle alert generation in the API
      };
      
      await addHealthIndicator(formattedData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving health indicator:', error);
    }
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
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};

export default HealthIndicatorDialog;
