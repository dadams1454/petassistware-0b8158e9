
import React from 'react';
import { ArrowUp, ArrowDown, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const FinancialDashboardWidget: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: financialSummary, isLoading } = useQuery({
    queryKey: ['financial-summary'],
    queryFn: async () => {
      // Get current month's first and last day
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      // Get previous month's first and last day
      const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
      const prevMonthFirstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      
      // Current month expenses
      const { data: currentExpenses, error: currentExpensesError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('transaction_type', 'expense')
        .gte('transaction_date', firstDay)
        .lte('transaction_date', lastDay);
      
      if (currentExpensesError) throw currentExpensesError;
      
      // Previous month expenses
      const { data: prevExpenses, error: prevExpensesError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('transaction_type', 'expense')
        .gte('transaction_date', prevMonthFirstDay)
        .lte('transaction_date', prevMonthLastDay);
      
      if (prevExpensesError) throw prevExpensesError;
      
      // Calculate totals
      const currentTotal = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const prevTotal = prevExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // Calculate percent change
      const percentChange = prevTotal ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0;
      
      return {
        currentMonthExpenses: currentTotal,
        previousMonthExpenses: prevTotal,
        percentChange: percentChange
      };
    }
  });
  
  const goToFinances = () => {
    navigate('/finances');
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium flex justify-between items-center">
          Financial Summary
          <Button variant="ghost" size="sm" onClick={goToFinances}>
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month Expenses</p>
                <p className="text-2xl font-bold">
                  ${financialSummary?.currentMonthExpenses.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center text-sm">
              {financialSummary?.percentChange === 0 ? (
                <TrendingUp className="mr-1 h-4 w-4 text-muted-foreground" />
              ) : financialSummary?.percentChange && financialSummary.percentChange > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              )}
              <span className={
                financialSummary?.percentChange === 0
                  ? 'text-muted-foreground'
                  : financialSummary?.percentChange && financialSummary.percentChange > 0
                    ? 'text-red-500'
                    : 'text-green-500'
              }>
                {financialSummary?.percentChange
                  ? `${Math.abs(financialSummary.percentChange).toFixed(1)}% ${
                      financialSummary.percentChange > 0 ? 'increase' : 'decrease'
                    }`
                  : 'No change'
                } from previous month
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialDashboardWidget;
