
import React, { useState } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Mail, Phone } from 'lucide-react';
import CustomerDialog from './CustomerDialog';
import { Skeleton } from '@/components/ui/skeleton';

type Customer = Tables<'customers'>;

interface CustomersListProps {
  customers: Customer[];
  isLoading: boolean;
  onCustomerUpdated: () => void;
}

const CustomersList: React.FC<CustomersListProps> = ({ 
  customers, 
  isLoading,
  onCustomerUpdated
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(searchTermLower) ||
      customer.last_name.toLowerCase().includes(searchTermLower) ||
      (customer.email && customer.email.toLowerCase().includes(searchTermLower)) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Information</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    {searchTerm ? "No customers match your search" : "No customers found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
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
                    <TableCell>{customer.address || 'Not specified'}</TableCell>
                    <TableCell>
                      <CustomerDialog 
                        customer={customer}
                        trigger={<Button variant="link">Edit</Button>}
                        onSuccess={onCustomerUpdated}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomersList;
