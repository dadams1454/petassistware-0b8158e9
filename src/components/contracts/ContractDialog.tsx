
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ContractForm from './ContractForm';

interface ContractDialogProps {
  trigger: React.ReactNode;
  puppyId?: string;
  onSuccess?: () => void;
}

const ContractDialog: React.FC<ContractDialogProps> = ({
  trigger,
  puppyId,
  onSuccess
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
        </DialogHeader>
        <ContractForm
          puppyId={puppyId || ''}
          onSubmit={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
