
import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import CustomersList from '@/components/customers/CustomersList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CustomerDialog from '@/components/customers/CustomerDialog';
import { CustomerWithMeta } from '@/types/customer';

// Export types for other components using alias to avoid conflict
import { 
  CustomerFilter, 
  SortField, 
  SortOrder 
} from '@/types/customers';

export type { 
  CustomerFilter, 
  SortField, 
  SortOrder 
};

const Customers: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithMeta | null>(null);

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsDialogOpen(true);
  };

  const handleEditCustomer = (customer: CustomerWithMeta) => {
    setSelectedCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <PageHeader 
            title="Customers"
            subtitle="Manage your customer relationships"
            className="mb-4 md:mb-0"
          />
          
          <Button onClick={handleAddCustomer}>
            <Plus className="h-4 w-4 mr-1" />
            Add Customer
          </Button>
        </div>
        
        <CustomersList 
          onEditCustomer={handleEditCustomer}
        />
        
        <CustomerDialog 
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          customer={selectedCustomer}
          // Added trigger to support contracts/CustomerSelector
          trigger={undefined}
        />
      </div>
    </PageContainer>
  );
};

export default Customers;
