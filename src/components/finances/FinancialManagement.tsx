
import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeader } from '@/components/ui/standardized';
import { DateRange } from 'react-day-picker';
import ExpenseDialog from './ExpenseDialog';
import ExpenseTable from './ExpenseTable';
import ExpenseFilters from './ExpenseFilters';
import ExpenseCategories from './ExpenseCategories';
import FinancialOverview from './FinancialOverview';
import ReceiptManager from './ReceiptManager';
import { useFinances } from './hooks/useFinances';
import { ExpenseFormValues } from './ExpenseForm';

const FinancialManagement: React.FC = () => {
  const {
    expenses,
    isLoading,
    filters,
    setFilters,
    addExpense,
    deleteExpense,
    updateExpense,
    isAdding,
    isUpdating,
  } = useFinances();

  const [activeTab, setActiveTab] = useState('expenses');
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setIsExpenseDialogOpen(true);
  };

  const handleEditExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setSelectedExpense({
        ...expense,
        date: new Date(expense.date),
        category: expense.category || '',
        paymentMethod: expense.payment_method || '',
      });
      setIsExpenseDialogOpen(true);
    }
  };

  const handleSaveExpense = async (data: ExpenseFormValues) => {
    if (selectedExpense) {
      await updateExpense(selectedExpense.id, data);
    } else {
      await addExpense(data);
    }
    setIsExpenseDialogOpen(false);
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilters(prev => ({ ...prev, dateRange: range ? [range.from, range.to] : [null, null] }));
  };

  const handleCategoryChange = (category: string | undefined) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleSearchQueryChange = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: [null, null],
      category: undefined,
      searchQuery: '',
    });
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) return;

    // Create CSV content
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Payment Method', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => [
        expense.date,
        `"${expense.description.replace(/"/g, '""')}"`,
        expense.category,
        expense.amount,
        expense.payment_method || '',
        `"${(expense.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Financial Management"
        description="Track and manage your kennel's finances"
        action={{
          label: activeTab === 'expenses' ? "Add Expense" : undefined,
          onClick: activeTab === 'expenses' ? handleAddExpense : undefined,
          icon: activeTab === 'expenses' ? <Plus size={16} /> : undefined,
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <ExpenseFilters
                dateRange={
                  filters.dateRange && filters.dateRange[0] && filters.dateRange[1]
                    ? { from: filters.dateRange[0], to: filters.dateRange[1] }
                    : undefined
                }
                onDateRangeChange={handleDateRangeChange}
                category={filters.category}
                onCategoryChange={handleCategoryChange}
                searchQuery={filters.searchQuery || ''}
                onSearchQueryChange={handleSearchQueryChange}
                onResetFilters={handleResetFilters}
              />
              
              <Button 
                variant="outline" 
                onClick={handleExportCSV}
                disabled={expenses.length === 0}
                className="hidden md:flex"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ExpenseTable
                  expenses={expenses}
                  isLoading={isLoading}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                />
              </div>
              <div className="lg:col-span-1">
                <ExpenseCategories
                  expenses={expenses}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="receipts">
          <ReceiptManager />
        </TabsContent>

        <TabsContent value="reports">
          <FinancialOverview
            expenses={expenses}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      <ExpenseDialog
        open={isExpenseDialogOpen}
        onOpenChange={setIsExpenseDialogOpen}
        onSave={handleSaveExpense}
        defaultValues={selectedExpense}
        isSubmitting={isAdding || isUpdating}
        title={selectedExpense ? 'Edit Expense' : 'Add Expense'}
      />
    </div>
  );
};

export default FinancialManagement;
