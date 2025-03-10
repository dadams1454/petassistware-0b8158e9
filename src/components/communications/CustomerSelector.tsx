
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';

interface CustomerSelectorProps {
  onCustomerSelected: (customer: any) => void;
  defaultValue?: string;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({ 
  onCustomerSelected,
  defaultValue
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || '');

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers-for-selector'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('last_name', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // If a default value is provided, select that customer initially
  useEffect(() => {
    if (defaultValue && customers) {
      const selectedCustomer = customers.find(c => c.id === defaultValue);
      if (selectedCustomer) {
        onCustomerSelected(selectedCustomer);
      }
    }
  }, [defaultValue, customers, onCustomerSelected]);

  const handleSelectCustomer = (customerId: string) => {
    setValue(customerId);
    setOpen(false);
    
    if (!customers) return;
    
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      onCustomerSelected(selectedCustomer);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value && customers
            ? customers.find((customer) => customer.id === value)
              ? `${customers.find((customer) => customer.id === value)?.first_name} ${customers.find((customer) => customer.id === value)?.last_name}`
              : "Select customer..."
            : "Select customer..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search customers..." />
          <CommandEmpty>
            {isLoading ? "Loading..." : "No customer found."}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {customers?.map((customer) => (
              <CommandItem
                key={customer.id}
                value={`${customer.first_name} ${customer.last_name} ${customer.email || ''}`}
                onSelect={() => handleSelectCustomer(customer.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === customer.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{customer.first_name} {customer.last_name}</span>
                  {customer.email && (
                    <span className="text-xs text-muted-foreground">{customer.email}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerSelector;
