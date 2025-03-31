
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Expense, ExpenseFormValues } from '@/types/financial';

/**
 * Fetches all expenses from the database
 */
export const fetchExpenses = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('transaction_type', 'expense')
    .order('transaction_date', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Creates a new expense record in the database
 */
export const createExpense = async (formData: ExpenseFormValues, userId: string | undefined) => {
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
    breeder_id: userId || null,
  };
  
  const { data, error } = await supabase
    .from('transactions')
    .insert([newTransaction])
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Uploads a receipt file to storage and returns the file path
 */
export const uploadReceipt = async (file: File, transactionId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `receipts/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('expenses')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error('Error uploading receipt:', uploadError);
    throw uploadError;
  }
  
  // Update transaction with receipt URL
  const { error: updateError } = await supabase
    .from('transactions')
    .update({ receipt_url: filePath })
    .eq('id', transactionId);
  
  if (updateError) {
    console.error('Error updating transaction with receipt URL:', updateError);
    throw updateError;
  }
  
  return filePath;
};

/**
 * Deletes an expense record and its associated receipt
 */
export const deleteExpense = async (id: string) => {
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
  
  return true;
};
