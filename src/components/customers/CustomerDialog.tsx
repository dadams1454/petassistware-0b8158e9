
import React, { useState } from 'react';
import { Tables } from '@/integrations/supabase/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CustomerForm from './CustomerForm';

type Customer = Tables<'customers'>;

interface CustomerDialogProps {
  trigger: React.ReactNode;
  customer?: Customer;
  onSuccess?: () => void;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({
  trigger,
  customer,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess();
  };

  const title = customer ? 'Edit Customer' : 'Add New Customer';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <CustomerForm
          customer={customer}
          onSubmit={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
