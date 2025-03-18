
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Customer } from './types/customer';
import CustomerForm from './CustomerForm';
import PuppyLitterData from './components/dialog/PuppyLitterData';
import CustomerTabs from './components/dialog/CustomerTabs';

interface CustomerDialogProps {
  trigger: React.ReactNode;
  customer?: Customer;
  onSuccess?: () => void;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({
  trigger,
  customer,
  onSuccess = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(customer ? 'view' : 'edit');

  const handleSuccess = () => {
    onSuccess();
    setOpen(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {customer ? `${customer.first_name} ${customer.last_name}` : 'Add Customer'}
          </DialogTitle>
        </DialogHeader>

        {customer ? (
          <PuppyLitterData customer={customer}>
            {({ puppy, litter }) => (
              <CustomerTabs
                customer={customer}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                puppy={puppy}
                litter={litter}
                onSuccess={handleSuccess}
                onCancel={() => setOpen(false)}
              />
            )}
          </PuppyLitterData>
        ) : (
          <CustomerForm onSubmit={handleSuccess} onCancel={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
