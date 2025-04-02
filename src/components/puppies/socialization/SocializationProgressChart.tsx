import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SocializationProgress, SocializationCategory } from '@/types/puppyTracking';

interface SocializationProgressChartProps {
  progressData: SocializationProgress[];
  categories: SocializationCategory[];
}

const SocializationProgressChart: React.FC<SocializationProgressChartProps> = ({
  progressData,
  categories
}) => {
  // Generate colors for each category
  const CATEGORY_COLORS: { [key: string]: string } = {};
  categories.forEach(cat => {
    CATEGORY_COLORS[cat.id] = cat.color || '#3b82f6';
  });

  // Prepare data for the chart
  const data = progressData.map(p => ({
    name: p.category_name || p.categoryName || '',
    id: p.id || p.categoryId || '', // Use id or categoryId
    value: p.count,
    completion: p.completion_percentage
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Socialization Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Completed Experiences" >
              {
                data.map(entry => (
                  <Bar key={entry.id} dataKey="value" fill={CATEGORY_COLORS[entry.id]} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SocializationProgressChart;
