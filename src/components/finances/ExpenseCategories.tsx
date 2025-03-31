
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { expenseCategories } from './constants';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpenseCategoriesProps {
  expenses: any[];
  isLoading: boolean;
}

const ExpenseCategories: React.FC<ExpenseCategoriesProps> = ({ expenses, isLoading }) => {
  // Calculate expense total per category
  const categoryTotals = expenseCategories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category.value);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      ...category,
      total,
      count: categoryExpenses.length
    };
  }).filter(cat => cat.count > 0).sort((a, b) => b.total - a.total);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>% of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryTotals.map((category) => (
              <TableRow key={category.value}>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {category.label}
                  </Badge>
                </TableCell>
                <TableCell>{category.count}</TableCell>
                <TableCell>${category.total.toFixed(2)}</TableCell>
                <TableCell>
                  {totalExpenses > 0 
                    ? `${((category.total / totalExpenses) * 100).toFixed(1)}%` 
                    : '0%'}
                </TableCell>
              </TableRow>
            ))}
            {categoryTotals.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No expenses recorded yet
                </TableCell>
              </TableRow>
            )}
            {categoryTotals.length > 0 && (
              <TableRow className="font-medium">
                <TableCell>Total</TableCell>
                <TableCell>{expenses.length}</TableCell>
                <TableCell>${totalExpenses.toFixed(2)}</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpenseCategories;
