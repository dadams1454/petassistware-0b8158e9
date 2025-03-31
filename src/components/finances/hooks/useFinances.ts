
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Expense, ExpenseFormValues } from '@/types/financial';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  fetchExpenses as fetchExpensesService,
  createExpense,
  uploadReceipt,
  deleteExpense as deleteExpenseService
} from '../services/expenseService';
import { mapTransactionToExpense } from '../utils/expenseUtils';

export function useFinances() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch expenses from Supabase
  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchExpensesService();
      const mappedExpenses = data.map(mapTransactionToExpense);
      setExpenses(mappedExpenses);
    } catch (err: any) {
      console.error('Error fetching expenses:', err);
      setError(err.message || 'Failed to fetch expenses');
      toast({
        title: 'Error',
        description: 'Failed to fetch expenses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Add expense to Supabase
  const addExpense = useCallback(async (formData: ExpenseFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create transaction record
      const data = await createExpense(formData, user?.id);
      
      // Handle receipt upload if provided
      let receipt_url = null;
      if (formData.receipt) {
        receipt_url = await uploadReceipt(formData.receipt, data.id);
      }
      
      // Map the response to our Expense interface for state update
      const newExpense = mapTransactionToExpense({
        ...data,
        receipt_url
      });
      
      setExpenses(prev => [newExpense, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Expense added successfully',
      });
      
      return newExpense;
    } catch (err: any) {
      console.error('Error adding expense:', err);
      setError(err.message || 'Failed to add expense');
      toast({
        title: 'Error',
        description: 'Failed to add expense',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  // Delete expense from Supabase
  const deleteExpense = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteExpenseService(id);
      
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      
      toast({
        title: 'Success',
        description: 'Expense deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting expense:', err);
      setError(err.message || 'Failed to delete expense');
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    expenses,
    isLoading,
    error,
    fetchExpenses,
    addExpense,
    deleteExpense,
  };
}
