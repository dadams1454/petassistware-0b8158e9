
import { Expense } from '@/types/financial';

/**
 * Maps a database transaction record to an Expense object
 */
export const mapTransactionToExpense = (data: any): Expense => {
  return {
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
    receipt_url: data.receipt_url,
    payment_method: data.payment_method
  };
};

/**
 * Formats a date object to string in YYYY-MM-DD format
 */
export const formatDateForStorage = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Filters expenses based on search query, category, and date range
 */
export const filterExpenses = (
  expenses: Expense[],
  searchQuery = '',
  category?: string,
  dateRange?: { from?: Date; to?: Date }
): Expense[] => {
  let filtered = [...expenses];

  // Apply date range filter
  if (dateRange?.from) {
    filtered = filtered.filter(expense => {
      const expenseDate = expense.date instanceof Date 
        ? expense.date 
        : new Date(expense.date);
      
      return (
        expenseDate >= dateRange.from! &&
        (!dateRange.to || expenseDate <= dateRange.to)
      );
    });
  }

  // Apply category filter
  if (category) {
    filtered = filtered.filter(expense => expense.category === category);
  }

  // Apply search query filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(expense =>
      expense.description.toLowerCase().includes(query) ||
      expense.notes?.toLowerCase().includes(query) ||
      expense.category.toLowerCase().includes(query)
    );
  }

  return filtered;
};
