
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Coins, Plus, Filter, Search } from 'lucide-react';
import { SectionHeader } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import ExpenseDialog from './ExpenseDialog';
import ExpenseTable from './ExpenseTable';
import { expenseCategories } from './constants';
import { Expense } from '@/types/financial';

const ExpenseTracker = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  
  // Mock expenses data that conforms to the Expense type
  const [expenses, setExpenses] = useState<Expense[]>([
    { 
      id: '1', 
      description: 'Dog Food', 
      amount: 120.50, 
      date: new Date(), 
      category: 'Food', 
      transaction_type: 'expense',
      transaction_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      breeder_id: '1'
    },
    { 
      id: '2', 
      description: 'Veterinary Checkup', 
      amount: 250.00, 
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
      category: 'Medical',
      transaction_type: 'expense',
      transaction_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      breeder_id: '1'
    }
  ]);
  
  const addExpense = (newExpense: any) => {
    const expense: Expense = { 
      id: Date.now().toString(),
      description: newExpense.description,
      amount: newExpense.amount,
      date: newExpense.date,
      category: newExpense.category,
      transaction_type: 'expense',
      transaction_date: newExpense.date.toISOString(),
      created_at: new Date().toISOString(),
      breeder_id: '1',
      notes: newExpense.notes,
      dog_id: newExpense.dog_id,
      puppy_id: newExpense.puppy_id,
      receipt: newExpense.receipt
    };
    
    setExpenses([...expenses, expense]);
    setIsDialogOpen(false);
  };
  
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Expense Tracking"
        description="Track and categorize your kennel expenses"
        action={{
          label: "Add Expense",
          onClick: () => setIsDialogOpen(true),
          icon: <Plus size={16} />
        }}
      />
      
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined}>All Categories</SelectItem>
            {expenseCategories.map(category => (
              <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <ExpenseTable expenses={filteredExpenses} />
      
      <ExpenseDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={addExpense}
      />
    </div>
  );
};

export default ExpenseTracker;
