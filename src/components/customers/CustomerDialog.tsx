
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CustomerForm from './CustomerForm';
import { Customer, CustomerWithMeta } from '@/types/customers';

interface CustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerWithMeta | null;
  // Add the trigger prop to support usage in contracts/CustomerSelector
  trigger?: React.ReactNode;
  // Add onSuccess to support being called after form submission
  onSuccess?: () => void;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({ 
  isOpen, 
  onClose, 
  customer,
  trigger,
  onSuccess
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {trigger && trigger}
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
        </DialogHeader>
        <CustomerForm
          customer={customer as Customer}
          onSubmit={() => {
            if (onSuccess) onSuccess();
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
