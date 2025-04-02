import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash, Mail, Phone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '../types/customer';
import { truncate } from '@/utils/utils'; // Updated import path

interface CustomerRowProps {
  customer: Customer;
  onCustomerUpdated: () => Promise<void>;
  onEditCustomer?: (customer: Customer) => void;
}

const CustomerRow: React.FC<CustomerRowProps> = ({ 
  customer, 
  onCustomerUpdated,
  onEditCustomer
}) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditCustomer = () => {
    if (onEditCustomer) {
      onEditCustomer(customer);
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customer.id);

      if (error) throw error;

      toast({
        title: 'Customer deleted',
        description: 'The customer has been removed successfully.'
      });
      
      await onCustomerUpdated();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the customer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{truncate(customer.id, 8)}</TableCell>
      <TableCell className="font-medium">{customer.first_name} {customer.last_name}</TableCell>
      <TableCell>{customer.email || '-'}</TableCell>
      <TableCell>{customer.phone || '-'}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {customer.email && (
            <Button variant="ghost" size="icon" asChild>
              <a href={`mailto:${customer.email}`} title="Send Email">
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          )}
          {customer.phone && (
            <Button variant="ghost" size="icon" asChild>
              <a href={`tel:${customer.phone}`} title="Call">
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEditCustomer}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteCustomer}
                disabled={isDeleting}
                className="text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CustomerRow;
