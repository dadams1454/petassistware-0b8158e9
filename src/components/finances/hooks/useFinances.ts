
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { Expense, ExpenseFormValues } from '@/types/financial';
import { useAuth } from '@/contexts/AuthProvider';

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
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('transaction_type', 'expense')
        .order('transaction_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Map the database records to our Expense interface
      const mappedExpenses: Expense[] = data.map(record => ({
        id: record.id,
        description: record.notes || '', // Using notes as description
        amount: record.amount,
        date: new Date(record.transaction_date),
        category: record.category,
        receipt: null,
        created_at: record.created_at,
        notes: record.notes,
        dog_id: record.dog_id,
        puppy_id: record.puppy_id,
        breeder_id: record.breeder_id,
        transaction_type: record.transaction_type,
        transaction_date: record.transaction_date,
        receipt_url: record.receipt_url
      }));
      
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
      const newTransaction = {
        id: uuidv4(),
        transaction_type: 'expense',
        amount: formData.amount,
        transaction_date: formData.date.toISOString().split('T')[0],
        category: formData.category,
        notes: formData.description,
        dog_id: formData.dog_id || null,
        puppy_id: formData.puppy_id || null,
        breeder_id: user?.id || null,
      };
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Handle receipt upload if provided
      let receipt_url = null;
      if (formData.receipt) {
        const fileExt = formData.receipt.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `receipts/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('expenses')
          .upload(filePath, formData.receipt);
        
        if (uploadError) {
          console.error('Error uploading receipt:', uploadError);
          // Continue with transaction creation even if receipt upload fails
        } else {
          receipt_url = filePath;
          
          // Update transaction with receipt URL
          const { error: updateError } = await supabase
            .from('transactions')
            .update({ receipt_url: filePath })
            .eq('id', data.id);
          
          if (updateError) {
            console.error('Error updating transaction with receipt URL:', updateError);
          }
        }
      }
      
      // Map the response to our Expense interface for state update
      const newExpense: Expense = {
        id: data.id,
        description: data.notes || '',
        amount: data.amount,
        date: new Date(data.transaction_date),
        category: data.category,
        receipt: null,
        created_at: data.created_at,
        notes: data.notes,
        dog_id: data.dog_id,
        puppy_id: data.puppy_id,
        breeder_id: data.breeder_id,
        transaction_type: data.transaction_type,
        transaction_date: data.transaction_date,
        receipt_url: receipt_url
      };
      
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
      // First, check if there's a receipt to delete
      const { data: transaction, error: fetchError } = await supabase
        .from('transactions')
        .select('receipt_url')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Delete receipt if it exists
      if (transaction.receipt_url) {
        const { error: storageError } = await supabase.storage
          .from('expenses')
          .remove([transaction.receipt_url]);
        
        if (storageError) {
          console.error('Error deleting receipt:', storageError);
          // Continue with transaction deletion even if receipt deletion fails
        }
      }
      
      // Delete transaction
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
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
