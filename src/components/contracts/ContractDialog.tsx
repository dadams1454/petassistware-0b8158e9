
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ContractForm from './ContractForm';

interface ContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  puppyId?: string;
  onSuccess?: () => void;
}

const ContractDialog: React.FC<ContractDialogProps> = ({
  open,
  onOpenChange,
  puppyId,
  onSuccess
}) => {
  const handleSuccess = () => {
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
        </DialogHeader>
        <ContractForm
          puppyId={puppyId || ''}
          onSubmit={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
