
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Banknote } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ExpenseTracking: React.FC = () => {
  const { toast } = useToast();
  
  const handleAddExpense = () => {
    toast({
      title: "Coming Soon",
      description: "Facility expense tracking will be implemented in a future update."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Banknote className="mr-2 h-5 w-5" />
            Facility Expenses
          </CardTitle>
          <Button onClick={handleAddExpense} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <Banknote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Expense Tracking Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This feature will allow you to track and categorize facility-related expenses,
              connect them to your financial reports, and analyze facility operating costs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracking;
