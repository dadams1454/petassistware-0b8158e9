
import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Layers } from 'lucide-react';
import { Customer } from './types/customer';
import { usePuppyData } from './hooks/usePuppyData';
import SearchBar from './components/SearchBar';
import CustomerRow from './components/CustomerRow';

export interface CustomersListProps {
  customers?: Customer[];
  isLoading: boolean;
  onCustomerUpdated: () => void;
  filters?: any;
  sort?: any;
  onEditCustomer?: (customer: Customer) => void;
}

interface GroupedCustomers {
  [litterName: string]: {
    litterName: string;
    customers: {
      customer: Customer;
      puppyInfo: ReturnType<typeof CustomersList.prototype.getPuppyInfo>;
    }[];
  };
}

const CustomersList: React.FC<CustomersListProps> = ({ 
  customers = [], // Provide default empty array to prevent "undefined" errors
  isLoading,
  onCustomerUpdated,
  onEditCustomer
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

  const groupCustomersByLitter = (customers: Customer[]): GroupedCustomers => {
    const grouped: GroupedCustomers = {
      'No Litter Assigned': {
        litterName: 'No Litter Assigned',
        customers: []
      }
    };

    customers.forEach(customer => {
      const puppyInfo = getPuppyInfo(customer);
      const litterName = puppyInfo?.litterName || 'No Litter Assigned';
      
      if (!grouped[litterName]) {
        grouped[litterName] = {
          litterName,
          customers: []
        };
      }
      
      grouped[litterName].customers.push({
        customer,
        puppyInfo
      });
    });

    return grouped;
  };

  const groupedCustomers = groupCustomersByLitter(filteredCustomers);

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
          <div className="space-y-6">
            {Object.entries(groupedCustomers).map(([litterName, group]) => (
              <div key={litterName} className="border rounded-lg">
                <div className="bg-muted p-3 rounded-t-lg flex items-center gap-2">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">{litterName}</h3>
                  <span className="text-sm text-muted-foreground">
                    ({group.customers.length} customers)
                  </span>
                </div>
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
                    {group.customers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No customers in this group
                        </TableCell>
                      </TableRow>
                    ) : (
                      group.customers.map(({ customer, puppyInfo }) => (
                        <CustomerRow
                          key={customer.id}
                          customer={customer}
                          puppyInfo={puppyInfo}
                          onCustomerUpdated={onCustomerUpdated}
                          onEditCustomer={onEditCustomer}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomersList;
