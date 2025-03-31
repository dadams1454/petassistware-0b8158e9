
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { expenseCategories } from './constants';
import { Skeleton } from '@/components/ui/skeleton';

interface FinancialOverviewProps {
  expenses: any[];
  isLoading: boolean;
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
];

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ 
  expenses, 
  isLoading,
  timeframe = 'month' 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  // Process data for charts
  const categoryData = expenseCategories
    .map(category => {
      const categoryExpenses = expenses.filter(expense => expense.category === category.value);
      const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        name: category.label,
        value: total,
        color: COLORS[expenseCategories.indexOf(category) % COLORS.length]
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // Group expenses by month
  const monthlyData = expenses.reduce((acc: any, expense) => {
    const date = new Date(expense.date);
    const month = date.toLocaleString('default', { month: 'short' });
    
    if (!acc[month]) {
      acc[month] = 0;
    }
    
    acc[month] += expense.amount;
    return acc;
  }, {});

  const monthlyChartData = Object.entries(monthlyData).map(([month, total]) => ({
    name: month,
    amount: total
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>
            Breakdown of expenses by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No expense data to display</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
          <CardDescription>
            Total expenses per month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No expense data to display</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialOverview;
