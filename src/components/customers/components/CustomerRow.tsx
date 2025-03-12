
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, User, Bookmark, Layers } from 'lucide-react';
import CustomerDialog from '../CustomerDialog';
import { Customer, Puppy } from '../types/customer';

interface CustomerRowProps {
  customer: Customer;
  puppyInfo: {
    id: string;
    name: string;
    color: string;
    gender: string;
    litterName?: string;
  } | null;
  onCustomerUpdated: () => void;
}

const CustomerRow: React.FC<CustomerRowProps> = ({ 
  customer, 
  puppyInfo, 
  onCustomerUpdated 
}) => {
  const getCustomerType = () => customer.metadata?.customer_type || 'new';
  
  const getCustomerSince = () => {
    if (!customer.metadata?.customer_since) return '';
    try {
      return new Date(customer.metadata.customer_since).toLocaleDateString();
    } catch (e) {
      return customer.metadata.customer_since;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {customer.first_name} {customer.last_name}
      </TableCell>
      <TableCell>
        <div className="flex flex-col space-y-1">
          {customer.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col space-y-1">
          <Badge variant={getCustomerType() === 'new' ? 'default' : 'secondary'}>
            {getCustomerType() === 'new' ? 'New Customer' : 'Returning Customer'}
          </Badge>
          {getCustomerSince() && (
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>Since {getCustomerSince()}</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {puppyInfo ? (
          <div className="flex items-center space-x-2">
            <Bookmark className="h-4 w-4 text-blue-500" />
            <div>
              <div className="font-medium">{puppyInfo.name}</div>
              <div className="text-xs text-muted-foreground">
                {puppyInfo.color} {puppyInfo.gender}
              </div>
              {puppyInfo.litterName && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                  <Layers className="h-3 w-3 text-indigo-500" />
                  <span className="font-medium">{puppyInfo.litterName}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">None</span>
        )}
      </TableCell>
      <TableCell>{customer.address || 'Not specified'}</TableCell>
      <TableCell>
        <CustomerDialog 
          customer={customer}
          trigger={<Button variant="link">Edit</Button>}
          onSuccess={onCustomerUpdated}
        />
      </TableCell>
    </TableRow>
  );
};

export default CustomerRow;
