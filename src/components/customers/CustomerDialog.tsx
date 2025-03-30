
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CustomerForm from './CustomerForm';
import { CustomerWithMeta } from '@/pages/Customers';

interface CustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerWithMeta | null;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({ isOpen, onClose, customer }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
        </DialogHeader>
        <CustomerForm
          customer={customer}
          onSuccess={() => {
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
