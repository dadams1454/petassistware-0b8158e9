
import React, { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Phone, User, Bookmark } from 'lucide-react';
import CustomerDialog from './CustomerDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

type Customer = Tables<'customers'> & {
  metadata?: {
    customer_type?: 'new' | 'returning';
    customer_since?: string;
    interested_puppy_id?: string;
  }
};

type Puppy = Tables<'puppies'>;

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
  const [puppiesData, setPuppiesData] = useState<Record<string, Puppy>>({});

  useEffect(() => {
    const fetchPuppies = async () => {
      // Get unique puppy IDs from customers
      const puppyIds = customers
        .map(customer => customer.metadata?.interested_puppy_id)
        .filter(id => id) as string[];
      
      if (puppyIds.length === 0) return;
      
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .in('id', puppyIds);
      
      if (error) {
        toast({
          title: "Error fetching puppies",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Convert array to record for easy lookup
      const puppiesRecord: Record<string, Puppy> = {};
      data?.forEach(puppy => {
        puppiesRecord[puppy.id] = puppy;
      });
      
      setPuppiesData(puppiesRecord);
    };
    
    fetchPuppies();
  }, [customers]);

  const filteredCustomers = customers.filter(customer => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(searchTermLower) ||
      customer.last_name.toLowerCase().includes(searchTermLower) ||
      (customer.email && customer.email.toLowerCase().includes(searchTermLower)) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTermLower))
    );
  });

  // Helper to get customer type
  const getCustomerType = (customer: Customer) => {
    if (!customer.metadata) return 'new';
    return customer.metadata?.customer_type || 'new';
  };

  // Helper to get formatted customer since date
  const getCustomerSince = (customer: Customer) => {
    if (!customer.metadata) return '';
    const since = customer.metadata?.customer_since;
    if (!since) return '';
    
    // Format date if it exists (could enhance this with date-fns)
    try {
      return new Date(since).toLocaleDateString();
    } catch (e) {
      return since;
    }
  };

  // Helper to get puppy info
  const getPuppyInfo = (customer: Customer) => {
    const puppyId = customer.metadata?.interested_puppy_id;
    if (!puppyId || !puppiesData[puppyId]) return null;
    
    const puppy = puppiesData[puppyId];
    return {
      id: puppy.id,
      name: puppy.name || `Puppy ${puppy.id.substring(0, 8)}`,
      color: puppy.color,
      gender: puppy.gender
    };
  };

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
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <Badge variant={getCustomerType(customer) === 'new' ? 'default' : 'secondary'}>
                          {getCustomerType(customer) === 'new' ? 'New Customer' : 'Returning Customer'}
                        </Badge>
                        {getCustomerSince(customer) && (
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>Since {getCustomerSince(customer)}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPuppyInfo(customer) ? (
                        <div className="flex items-center space-x-2">
                          <Bookmark className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="font-medium">{getPuppyInfo(customer)?.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {getPuppyInfo(customer)?.color} {getPuppyInfo(customer)?.gender}
                            </div>
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
