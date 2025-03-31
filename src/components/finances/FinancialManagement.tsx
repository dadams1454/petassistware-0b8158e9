
import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { SectionHeader } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useFinances } from './hooks/useFinances';
import ExpenseDialog from './ExpenseDialog';
import ExpenseTable from './ExpenseTable';
import ExpenseFilters from './ExpenseFilters';
import ExpenseCategories from './ExpenseCategories';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Expense } from '@/types/financial';

const FinancialManagement: React.FC = () => {
  const {
    expenses,
    isLoading,
    error,
    fetchExpenses,
    addExpense,
    deleteExpense,
  } = useFinances();

  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Load expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Apply filters when expenses or filter criteria change
  useEffect(() => {
    if (!expenses) return;
    
    let filtered = [...expenses];

    // Apply date range filter
    if (dateRange?.from) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= dateRange.from! &&
          (!dateRange.to || expenseDate <= dateRange.to)
        );
      });
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
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

    setFilteredExpenses(filtered);
  }, [expenses, dateRange, selectedCategory, searchQuery]);

  const handleAddExpense = async (formData: any) => {
    setIsSubmitting(true);
    await addExpense(formData);
    setIsSubmitting(false);
    setIsExpenseDialogOpen(false);
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
  };

  const handleResetFilters = () => {
    setDateRange(undefined);
    setSelectedCategory(undefined);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Financial Management"
        description="Track and manage kennel expenses"
        action={{
          label: "Add Expense",
          onClick: () => setIsExpenseDialogOpen(true),
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <ExpenseFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onResetFilters={handleResetFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-6 text-center text-red-500">
                {error}
              </CardContent>
            </Card>
          ) : (
            <ExpenseTable
              expenses={filteredExpenses}
              onDelete={handleDeleteExpense}
            />
          )}
        </div>

        <div>
          <ExpenseCategories
            expenses={filteredExpenses}
            isLoading={isLoading}
          />
        </div>
      </div>

      <ExpenseDialog
        open={isExpenseDialogOpen}
        onOpenChange={setIsExpenseDialogOpen}
        onSave={handleAddExpense}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default FinancialManagement;
