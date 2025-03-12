
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Customer } from './types/customer';
import CustomerForm from './CustomerForm';
import CustomerWaitlistStatus from '../waitlist/CustomerWaitlistStatus';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

  // Fetch puppy details if customer is interested in one
  const { data: puppy } = useQuery({
    queryKey: ['puppy', customer?.metadata?.interested_puppy_id],
    queryFn: async () => {
      if (!customer?.metadata?.interested_puppy_id) return null;
      
      const { data, error } = await supabase
        .from('puppies')
        .select('*, litters(litter_name)')
        .eq('id', customer.metadata.interested_puppy_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!customer?.metadata?.interested_puppy_id
  });
  
  // Fetch litter details if customer is interested in one
  const { data: litter } = useQuery({
    queryKey: ['litter', customer?.metadata?.interested_litter_id],
    queryFn: async () => {
      if (!customer?.metadata?.interested_litter_id) return null;
      
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dogs!litters_dam_id_fkey(name, breed),
          sire:dogs!litters_sire_id_fkey(name, breed)
        `)
        .eq('id', customer.metadata.interested_litter_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!customer?.metadata?.interested_litter_id
  });

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
                  <p>
                    <span className="text-muted-foreground mr-2">Waitlist Type:</span>
                    {customer.metadata?.waitlist_type === 'open' ? 'Open Waitlist (Any Future Litter)' : 'Specific Litter'}
                  </p>
                </div>
              </div>

              {litter && (
                <div>
                  <h3 className="font-semibold mb-2">Interested Litter</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground mr-2">Litter Name:</span>
                      {litter.litter_name || 'Unnamed Litter'}
                    </p>
                    <p>
                      <span className="text-muted-foreground mr-2">Dam:</span>
                      {litter.dam?.name || 'N/A'}
                    </p>
                    <p>
                      <span className="text-muted-foreground mr-2">Sire:</span>
                      {litter.sire?.name || 'N/A'}
                    </p>
                    <p>
                      <span className="text-muted-foreground mr-2">Birth Date:</span>
                      {litter.birth_date ? new Date(litter.birth_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )}

              {puppy && (
                <div>
                  <h3 className="font-semibold mb-2">Interested Puppy</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground mr-2">Puppy Name:</span>
                      {puppy.name || 'Unnamed'}
                    </p>
                    <p>
                      <span className="text-muted-foreground mr-2">Litter:</span>
                      {(puppy.litters as any)?.litter_name || 'N/A'}
                    </p>
                    <p>
                      <span className="text-muted-foreground mr-2">Color:</span>
                      {puppy.color || 'N/A'}
                    </p>
                    <p>
                      <span className="text-muted-foreground mr-2">Gender:</span>
                      {puppy.gender || 'N/A'}
                    </p>
                    <p>
                      <span className="text-muted-foreground mr-2">Status:</span>
                      {puppy.status || 'N/A'}
                    </p>
                  </div>
                </div>
              )}

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

            <TabsContent value="edit" className="mt-4">
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
