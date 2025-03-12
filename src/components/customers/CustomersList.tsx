import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Customer } from './types/customer';
import { usePuppyData } from './hooks/usePuppyData';
import SearchBar from './components/SearchBar';
import CustomerRow from './components/CustomerRow';

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
  const puppiesData = usePuppyData(customers);

  const filteredCustomers = customers.filter(customer => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(searchTermLower) ||
      customer.last_name.toLowerCase().includes(searchTermLower) ||
      (customer.email && customer.email.toLowerCase().includes(searchTermLower)) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTermLower))
    );
  });

  const getPuppyInfo = (customer: Customer) => {
    const puppyId = customer.metadata?.interested_puppy_id;
    if (!puppyId || !puppiesData[puppyId]) return null;
    
    const puppy = puppiesData[puppyId];
    return {
      id: puppy.id,
      name: puppy.name || `Puppy ${puppy.id.substring(0, 8)}`,
      color: puppy.color,
      gender: puppy.gender,
      litterName: puppy.litterName
    };
  };

  return (
    <Card>
      <CardContent className="p-6">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

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
                <TableHead>Status</TableHead>
                <TableHead>Interested Puppy</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    {searchTerm ? "No customers match your search" : "No customers found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    puppyInfo={getPuppyInfo(customer)}
                    onCustomerUpdated={onCustomerUpdated}
                  />
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
