
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import CustomersList from '@/components/customers/CustomersList';
import CustomerDialog from '@/components/customers/CustomerDialog';
import { toast } from '@/components/ui/use-toast';

type Customer = Tables<'customers'> & {
  metadata?: {
    customer_type?: 'new' | 'returning';
    customer_since?: string;
    interested_puppy_id?: string;
  }
};

const Customers = () => {
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

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Customers</h1>
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

        <CustomersList 
          customers={customers || []} 
          isLoading={isLoading} 
          onCustomerUpdated={() => refetch()}
        />
      </div>
    </MainLayout>
  );
};

export default Customers;
