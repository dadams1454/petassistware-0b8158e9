
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocializationProgress } from '@/types/puppyTracking';

interface SocializationProgressChartProps {
  progressData: SocializationProgress[];
}

const SocializationProgressChart: React.FC<SocializationProgressChartProps> = ({ 
  progressData 
}) => {
  // Only include categories with data
  const filteredData = progressData.filter(item => item.count > 0);
  
  // Transform data for the chart
  const chartData = filteredData.map(item => ({
    name: item.category_name,
    id: item.categoryId,
    value: item.count,
    completion: item.completion_percentage
  }));
  
  // Colors for the chart
  const COLORS = [
    '#2563eb', // blue
    '#16a34a', // green
    '#9333ea', // purple
    '#ea580c', // orange
    '#ca8a04', // yellow
    '#0891b2', // cyan
    '#4f46e5', // indigo
    '#db2777', // pink
    '#65a30d', // lime
    '#1e293b', // slate
  ];
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md p-2 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{data.value} experiences</p>
          <p className="text-sm text-muted-foreground">
            {data.completion}% complete
          </p>
        </div>
      );
    }
    return null;
  };
  
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Socialization Progress</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No socialization data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Socialization by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${entry.categoryId}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocializationProgressChart;
