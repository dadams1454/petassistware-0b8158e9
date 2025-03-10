
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ContractForm from './ContractForm';
import { createContract } from '@/services/contractService';
import { useToast } from '@/components/ui/use-toast';

interface ContractDialogProps {
  trigger: React.ReactNode;
  puppyId?: string;
  onSuccess?: () => void;
}

const ContractDialog: React.FC<ContractDialogProps> = ({
  trigger,
  puppyId = '',
  onSuccess
}) => {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createContract({
        puppy_id: puppyId,
        customer_id: data.customer_id,
        contract_date: data.contract_date,
        contract_type: data.contract_type,
        price: data.price,
        notes: data.notes,
        signed: false
      });
      
      setOpen(false);
      toast({
        title: "Contract created",
        description: "The contract has been successfully created",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "Error",
        description: "Failed to create contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
        </DialogHeader>
        <ContractForm
          puppyId={puppyId}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isLoading={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
