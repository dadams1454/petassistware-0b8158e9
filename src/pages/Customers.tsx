
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import CustomerFilters from '@/components/customers/CustomerFilters';
import CustomersList from '@/components/customers/CustomersList';
import CustomerDialog from '@/components/customers/CustomerDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Export types needed by other components
export type CustomerFilter = {
  type: 'all' | 'new' | 'returning';
  interestedInPuppies: boolean | null;
};

export type SortField = 'name' | 'date' | 'litter';
export type SortOrder = 'asc' | 'desc';

// Extended customer type with metadata
export type CustomerWithMeta = Tables<'customers'> & {
  metadata?: {
    customer_type?: 'new' | 'returning';
    customer_since?: string;
    interested_puppy_id?: string;
    interested_litter_id?: string;
    waitlist_type?: 'specific' | 'open';
  }
};

const Customers: React.FC = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithMeta | null>(null);
  const [customers, setCustomers] = useState<CustomerWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<CustomerFilter>({
    type: 'all',
    interestedInPuppies: null
  });
  const [sort, setSort] = useState<{ field: SortField; order: SortOrder }>({
    field: 'name',
    order: 'asc'
  });

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*');
      
      if (error) throw error;
      
      setCustomers(data as CustomerWithMeta[]);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

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
        
        <div className="space-y-4">
          <CustomerFilters 
            filters={filters}
            onFiltersChange={setFilters}
            sort={sort}
            onSortChange={setSort}
          />
          
          <CustomersList 
            customers={customers}
            isLoading={isLoading}
            onCustomerUpdated={loadCustomers}
            onEditCustomer={handleEditCustomer}
          />
        </div>
        
        <CustomerDialog 
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          customer={selectedCustomer}
        />
      </div>
    </PageContainer>
  );
};

export default Customers;
