
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
import { Loader2, Plus } from 'lucide-react';
import { Button } from '../ui/button';

type Customer = Tables<'customers'>;

export interface CustomerSelectorProps {
  form: UseFormReturn<any>;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({ form }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchCustomers();
  }, []);

  return (
    <div className="relative">
      <Select 
        onValueChange={(value) => form.setValue('customer_id', value)} 
        defaultValue={form.getValues('customer_id') || ""}
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
              {customers.length === 0 && (
                <div className="text-center p-2 text-sm text-muted-foreground">
                  No customers found
                </div>
              )}
            </>
          )}
        </SelectContent>
      </Select>
      <Button 
        className="absolute -right-10 top-0" 
        variant="outline" 
        size="icon"
        type="button"
        title="Add new customer"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CustomerSelector;
