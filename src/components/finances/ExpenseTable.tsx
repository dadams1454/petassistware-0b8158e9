
import React from 'react';
import { format } from 'date-fns';
import { Eye, Edit, Trash2, Receipt } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  receipt: string | null;
}

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
  onViewReceipt?: (expense: Expense) => void;
}

const ExpenseTable = ({ expenses, onEdit, onDelete, onViewReceipt }: ExpenseTableProps) => {
  if (expenses.length === 0) {
    return (
      <div className="flex justify-center items-center p-12 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">No expenses found. Add a new expense to get started.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Receipt</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map(expense => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.description}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
              <TableCell>{format(expense.date, 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <Badge variant="outline">{expense.category}</Badge>
              </TableCell>
              <TableCell>
                {expense.receipt ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewReceipt && onViewReceipt(expense)}
                  >
                    <Receipt className="h-4 w-4 mr-1" />
                    View
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">None</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit && onEdit(expense)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete && onDelete(expense)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseTable;
