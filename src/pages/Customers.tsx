
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomersList from '@/components/customers/CustomersList';
import CustomerDialog from '@/components/customers/CustomerDialog';
import { toast } from '@/components/ui/use-toast';
import CustomerFilters from '@/components/customers/CustomerFilters';
import { useNavigate } from 'react-router-dom';

export type SortField = 'name' | 'date' | 'litter';
export type SortOrder = 'asc' | 'desc';
export type CustomerFilter = {
  type: 'all' | 'new' | 'returning';
  interestedInPuppies: boolean | null;
};

type Customer = Tables<'customers'> & {
  metadata?: {
    customer_type?: 'new' | 'returning';
    customer_since?: string;
    interested_puppy_id?: string;
  }
};

const Customers = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CustomerFilter>({
    type: 'all',
    interestedInPuppies: null,
  });
  const [sort, setSort] = useState<{ field: SortField; order: SortOrder }>({
    field: 'name',
    order: 'asc',
  });

  const { data: customers, isLoading, error, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('last_name', { ascending: true });
      
      if (error) throw error;
      return data as Customer[];
    }
  });

  if (error) {
    toast({
      title: "Error loading customers",
      description: error.message,
      variant: "destructive"
    });
  }

  // Apply filters and sorting to the customer list
  const filteredAndSortedCustomers = React.useMemo(() => {
    if (!customers) return [];
    
    // Filter by customer type and puppy interest
    let filtered = customers.filter(customer => {
      // Filter by customer type (new/returning)
      if (filters.type !== 'all') {
        const customerType = customer.metadata?.customer_type || 'new';
        if (customerType !== filters.type) return false;
      }
      
      // Filter by interest in puppies
      if (filters.interestedInPuppies !== null) {
        const hasInterest = !!customer.metadata?.interested_puppy_id;
        if (hasInterest !== filters.interestedInPuppies) return false;
      }
      
      return true;
    });
    
    // Apply sorting
    return filtered.sort((a, b) => {
      if (sort.field === 'name') {
        const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
        const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
        return sort.order === 'asc' 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      } else if (sort.field === 'date') {
        const dateA = a.created_at || '';
        const dateB = b.created_at || '';
        return sort.order === 'asc'
          ? dateA.localeCompare(dateB)
          : dateB.localeCompare(dateA);
      } else if (sort.field === 'litter') {
        const litterIdA = a.metadata?.interested_puppy_id || '';
        const litterIdB = b.metadata?.interested_puppy_id || '';
        return sort.order === 'asc'
          ? litterIdA.localeCompare(litterIdB)
          : litterIdB.localeCompare(litterIdA);
      }
      return 0;
    });
  }, [customers, filters, sort]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Customers</h1>
        </div>
        <CustomerDialog 
          trigger={
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          }
          onSuccess={() => refetch()}
        />
      </div>

      <CustomerFilters 
        filters={filters}
        onFiltersChange={setFilters}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="mt-4">
        <CustomersList 
          customers={filteredAndSortedCustomers} 
          isLoading={isLoading} 
          onCustomerUpdated={() => refetch()}
        />
      </div>
    </div>
  );
};

export default Customers;
