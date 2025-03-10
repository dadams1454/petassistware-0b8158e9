
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Customer } from './types/customer';
import CustomerForm from './CustomerForm';
import CustomerWaitlistStatus from '../waitlist/CustomerWaitlistStatus';

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
    if (onSuccess) {
      onSuccess();
    }
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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="view">Customer Details</TabsTrigger>
              <TabsTrigger value="waitlist">Waitlist Status</TabsTrigger>
              <TabsTrigger value="edit">Edit Customer</TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground mr-2">Email:</span>
                    {customer.email || 'N/A'}
                  </p>
                  <p>
                    <span className="text-muted-foreground mr-2">Phone:</span>
                    {customer.phone || 'N/A'}
                  </p>
                  <p>
                    <span className="text-muted-foreground mr-2">Address:</span>
                    {customer.address || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Customer Details</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground mr-2">Type:</span>
                    {customer.metadata?.customer_type === 'returning' ? 'Returning Customer' : 'New Customer'}
                  </p>
                  <p>
                    <span className="text-muted-foreground mr-2">Customer Since:</span>
                    {customer.metadata?.customer_since || 'N/A'}
                  </p>
                </div>
              </div>

              {customer.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="waitlist" className="mt-4">
              <CustomerWaitlistStatus customerId={customer.id} />
            </TabsContent>

            <TabsContent value="edit">
              <CustomerForm
                customer={customer}
                onSubmit={handleSuccess}
                onCancel={() => setActiveTab('view')}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <CustomerForm onSubmit={handleSuccess} onCancel={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
