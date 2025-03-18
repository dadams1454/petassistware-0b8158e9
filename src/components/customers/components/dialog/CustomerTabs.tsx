
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerDetails from './CustomerDetails';
import CustomerWaitlistStatus from '@/components/waitlist/CustomerWaitlistStatus';
import CustomerForm from '../../CustomerForm';
import { Customer } from '../../types/customer';

interface CustomerTabsProps {
  customer: Customer;
  activeTab: string;
  onTabChange: (value: string) => void;
  puppy: any | null;
  litter: any | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CustomerTabs: React.FC<CustomerTabsProps> = ({
  customer,
  activeTab,
  onTabChange,
  puppy,
  litter,
  onSuccess,
  onCancel
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="view">Customer Details</TabsTrigger>
        <TabsTrigger value="waitlist">Waitlist Status</TabsTrigger>
        <TabsTrigger value="edit">Edit Customer</TabsTrigger>
      </TabsList>

      <TabsContent value="view">
        <CustomerDetails 
          customer={customer} 
          puppy={puppy} 
          litter={litter} 
        />
      </TabsContent>
      
      <TabsContent value="waitlist" className="mt-4">
        <CustomerWaitlistStatus customerId={customer.id} />
      </TabsContent>

      <TabsContent value="edit" className="mt-4">
        <CustomerForm
          customer={customer}
          onSubmit={onSuccess}
          onCancel={() => onTabChange('view')}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CustomerTabs;
