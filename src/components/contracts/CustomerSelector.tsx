
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomerDialog from '@/components/customers/CustomerDialog';

type Customer = Tables<'customers'>;

export interface CustomerSelectorProps {
  form: UseFormReturn<any>;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({ form }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('last_name', { ascending: true });
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCustomerAdded = () => {
    fetchCustomers();
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-2">
      <Select 
        onValueChange={(value) => form.setValue('customer_id', value)} 
        defaultValue={form.getValues('customer_id')}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Loading customers..." : "Select customer"} />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Loading...</span>
            </div>
          ) : (
            <>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.first_name} {customer.last_name}
                </SelectItem>
              ))}
              <div className="px-2 py-1.5 border-t">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDialogOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Customer
                </Button>
              </div>
            </>
          )}
        </SelectContent>
      </Select>

      {isDialogOpen && (
        <CustomerDialog
          trigger={<></>} // We don't need a trigger as we're controlling open state manually
          onSuccess={handleCustomerAdded}
        />
      )}
    </div>
  );
};

export default CustomerSelector;
