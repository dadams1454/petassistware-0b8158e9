
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Customer } from '../types/customer';
import { CustomerWithMeta } from '@/pages/Customers';

interface CustomerRowProps {
  customer: Customer;
  puppyInfo: any | null;
  onCustomerUpdated: () => void;
  onEditCustomer?: (customer: CustomerWithMeta) => void;
}

const CustomerRow: React.FC<CustomerRowProps> = ({ 
  customer, 
  puppyInfo, 
  onCustomerUpdated,
  onEditCustomer
}) => {
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{customer.first_name} {customer.last_name}</div>
        <div className="text-sm text-muted-foreground">
          {customer.metadata?.customer_type === 'returning' ? 'Returning Customer' : 'New Customer'}
        </div>
      </TableCell>
      
      <TableCell>
        <div>{customer.email}</div>
        <div>{customer.phone}</div>
      </TableCell>
      
      <TableCell>
        {customer.metadata?.waitlist_type ? (
          <div className="text-sm">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {customer.metadata.waitlist_type === 'open' ? 'Open Waitlist' : 'Specific Litter'}
            </span>
          </div>
        ) : 'Not on waitlist'}
      </TableCell>
      
      <TableCell>
        {puppyInfo ? (
          <div>
            <div className="font-medium">{puppyInfo.name}</div>
            <div className="text-sm text-muted-foreground">
              {puppyInfo.color}, {puppyInfo.gender}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">None</div>
        )}
      </TableCell>
      
      <TableCell>
        <div className="max-w-[200px] truncate">
          {customer.address || "No address provided"}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEditCustomer && onEditCustomer(customer as CustomerWithMeta)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CustomerRow;
