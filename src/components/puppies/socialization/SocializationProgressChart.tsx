
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SocializationCategory, SocializationProgress } from '@/types/puppyTracking';
import { Card, CardContent } from '@/components/ui/card';

interface SocializationProgressChartProps {
  progress: SocializationProgress[];
  categories: SocializationCategory[];
}

const SocializationProgressChart: React.FC<SocializationProgressChartProps> = ({ 
  progress,
  categories 
}) => {
  const chartData = progress.map(item => {
    const category = categories.find(c => c.id === item.categoryId);
    return {
      categoryName: category?.name || item.categoryName,
      completionPercentage: item.completionPercentage,
      count: item.count,
      target: item.target
    };
  });

  // Get colors based on the categories
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#4f46e5'; // Default to indigo if color not found
  };

  // Color based on completion percentage
  const getCompletionColor = (percentage: number) => {
    if (percentage >= 100) return 'rgb(34, 197, 94)'; // Green for 100%+
    if (percentage >= 75) return 'rgb(59, 130, 246)'; // Blue for 75%+
    if (percentage >= 50) return 'rgb(249, 115, 22)'; // Orange for 50%+
    return 'rgb(239, 68, 68)'; // Red for <50%
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 0,
                  left: 0,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="categoryName" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis 
                  unit="%" 
                  domain={[0, 100]}
                  label={{ 
                    value: 'Completion %', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Completion']} />
                <Bar
                  dataKey="completionPercentage"
                  name="Completion"
                  fill="rgb(79, 70, 229)"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {progress.map((item, index) => (
          <Card key={item.categoryId} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.categoryName}</span>
                  <span className="text-sm font-semibold">{item.completionPercentage}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${Math.min(item.completionPercentage, 100)}%`,
                      backgroundColor: getCompletionColor(item.completionPercentage)
                    }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{item.count} completed</span>
                  <span>Target: {item.target}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocializationProgressChart;
