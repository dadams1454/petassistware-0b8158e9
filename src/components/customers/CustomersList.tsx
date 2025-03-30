
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from './types/customer';
import CustomerRow from './components/CustomerRow';

interface CustomersListProps {
  className?: string;
  customers?: Customer[];
  isLoading?: boolean;
  onCustomerUpdated?: () => Promise<void>;
  onEditCustomer?: (customer: Customer) => void;
}

const CustomersList: React.FC<CustomersListProps> = ({ 
  className,
  customers: externalCustomers,
  isLoading: externalIsLoading,
  onCustomerUpdated: externalOnCustomerUpdated,
  onEditCustomer
}) => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Use external data if provided, otherwise load data internally
  useEffect(() => {
    if (externalCustomers) {
      setCustomers(externalCustomers);
      if (externalIsLoading !== undefined) {
        setIsLoading(externalIsLoading);
      } else {
        setIsLoading(false);
      }
    } else {
      loadCustomers();
    }
  }, [externalCustomers, externalIsLoading]);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onCustomerUpdated = async () => {
    if (externalOnCustomerUpdated) {
      await externalOnCustomerUpdated();
    } else {
      await loadCustomers();
    }
  };

  const handleCreateCustomer = () => {
    navigate('/customers/new');
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  let filteredCustomers = [...customers];

  if (searchQuery) {
    filteredCustomers = customers.filter(customer => 
      customer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={cn("container mx-auto py-6 px-4", className)}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="text-2xl font-semibold">Customers</div>
        <div className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={handleCreateCustomer}>
            <Plus className="h-4 w-4 mr-1" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading customers...</TableCell>
              </TableRow>
            ) : paginatedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No customers found.</TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((customer) => (
                <CustomerRow 
                  key={customer.id} 
                  customer={customer} 
                  onCustomerUpdated={onCustomerUpdated}
                  onEditCustomer={onEditCustomer} 
                />
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            handlePageChange(currentPage - 1);
                          }
                        }}
                        aria-disabled={currentPage === 1}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(i + 1);
                          }}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            handlePageChange(currentPage + 1);
                          }
                        }}
                        aria-disabled={currentPage === totalPages || totalPages === 0}
                        className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default CustomersList;
