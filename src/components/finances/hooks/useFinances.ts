
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ExpenseFormValues } from '../ExpenseForm';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  payment_method?: string;
  receipt_url?: string;
  notes?: string;
  dog_id?: string;
  puppy_id?: string;
  created_at: string;
  breeder_id: string;
}

interface FinancesFilter {
  dateRange?: [Date | null, Date | null];
  category?: string;
  searchQuery?: string;
  dogId?: string;
  puppyId?: string;
}

export const useFinances = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FinancesFilter>({
    dateRange: [null, null],
    category: undefined,
    searchQuery: '',
    dogId: undefined,
    puppyId: undefined,
  });
  
  // Get expenses with filtering
  const { data: expenses, isLoading, refetch } = useQuery({
    queryKey: ['expenses', filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('transaction_type', 'expense');
      
      // Apply date range filter if provided
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        const startDate = filters.dateRange[0].toISOString().split('T')[0];
        const endDate = filters.dateRange[1].toISOString().split('T')[0];
        query = query.gte('transaction_date', startDate).lte('transaction_date', endDate);
      }
      
      // Apply category filter if provided
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      // Apply search filter if provided
      if (filters.searchQuery) {
        query = query.ilike('notes', `%${filters.searchQuery}%`);
      }
      
      // Apply dog filter if provided
      if (filters.dogId) {
        query = query.eq('dog_id', filters.dogId);
      }
      
      // Apply puppy filter if provided
      if (filters.puppyId) {
        query = query.eq('puppy_id', filters.puppyId);
      }
      
      // Order by date, most recent first
      query = query.order('transaction_date', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as Expense[];
    }
  });
  
  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: ExpenseFormValues) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          description: newExpense.description,
          amount: newExpense.amount,
          transaction_date: newExpense.date.toISOString().split('T')[0],
          category: newExpense.category,
          transaction_type: 'expense',
          payment_method: newExpense.paymentMethod,
          notes: newExpense.notes,
          dog_id: newExpense.dogId || null,
          puppy_id: newExpense.puppyId || null,
          receipt_url: newExpense.receiptUrl || null,
        })
        .select();
      
      if (error) throw error;
      return data[0] as Expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Expense added',
        description: 'Your expense has been successfully recorded',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding expense',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', expenseId);
      
      if (error) throw error;
      return expenseId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Expense deleted',
        description: 'The expense has been removed from your records',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting expense',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: async ({ id, expense }: { id: string; expense: ExpenseFormValues }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          description: expense.description,
          amount: expense.amount,
          transaction_date: expense.date.toISOString().split('T')[0],
          category: expense.category,
          payment_method: expense.paymentMethod,
          notes: expense.notes,
          dog_id: expense.dogId || null,
          puppy_id: expense.puppyId || null,
          receipt_url: expense.receiptUrl || null,
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as Expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Expense updated',
        description: 'Your expense has been successfully updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating expense',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const addExpense = (expense: ExpenseFormValues) => {
    return addExpenseMutation.mutateAsync(expense);
  };
  
  const deleteExpense = (id: string) => {
    return deleteExpenseMutation.mutateAsync(id);
  };
  
  const updateExpense = (id: string, expense: ExpenseFormValues) => {
    return updateExpenseMutation.mutateAsync({ id, expense });
  };
  
  return {
    expenses: expenses || [],
    isLoading,
    filters,
    setFilters,
    addExpense,
    deleteExpense,
    updateExpense,
    isAdding: addExpenseMutation.isPending,
    isDeleting: deleteExpenseMutation.isPending,
    isUpdating: updateExpenseMutation.isPending,
    refetch,
  };
};
