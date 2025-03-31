
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { expenseCategories } from './constants';
import { FileText, Search, Plus } from 'lucide-react';

interface MedicalExpensesProps {
  dogId?: string;
}

const MedicalExpenses: React.FC<MedicalExpensesProps> = ({ dogId }) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch transactions from Supabase
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['medical-expenses', dogId, page],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('category', 'Medical')
        .order('transaction_date', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (dogId) {
        query = query.eq('dog_id', dogId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Medical & Veterinary Expenses</span>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </CardTitle>
        <CardDescription>
          Track and manage all your veterinary and medical expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : transactions && transactions.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {format(new Date(transaction.transaction_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div>
                        {transaction.notes || 'No description'}
                      </div>
                      {transaction.dog_id && (
                        <Badge variant="outline" className="mt-1">
                          Dog Specific
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {transaction.receipt_url ? (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={transaction.receipt_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setPage(page - 1)} 
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {page}</span>
              <Button 
                variant="outline" 
                onClick={() => setPage(page + 1)} 
                disabled={transactions.length < pageSize}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No Medical Expenses Found</h3>
            <p className="text-muted-foreground mb-4">
              {dogId 
                ? "You haven't recorded any medical expenses for this dog yet." 
                : "You haven't recorded any medical expenses yet."}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Record Medical Expense
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalExpenses;
