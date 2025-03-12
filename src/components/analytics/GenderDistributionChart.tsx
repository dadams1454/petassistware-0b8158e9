
import React, { useMemo } from 'react';
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface GenderDistributionChartProps {
  puppies: Puppy[];
  title?: string;
}

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({ 
  puppies,
  title = "Gender Distribution"
}) => {
  const chartData = useMemo(() => {
    const maleCount = puppies.filter(puppy => 
      puppy.gender?.toLowerCase() === 'male').length;
    const femaleCount = puppies.filter(puppy => 
      puppy.gender?.toLowerCase() === 'female').length;
    const unknownCount = puppies.filter(puppy => 
      !puppy.gender || puppy.gender.toLowerCase() !== 'male' && puppy.gender.toLowerCase() !== 'female').length;
    
    const data = [];
    
    if (maleCount > 0) {
      data.push({ name: 'Male', value: maleCount });
    }
    
    if (femaleCount > 0) {
      data.push({ name: 'Female', value: femaleCount });
    }
    
    if (unknownCount > 0) {
      data.push({ name: 'Unknown', value: unknownCount });
    }
    
    return data;
  }, [puppies]);
  
  const COLORS = ['#2563eb', '#db2777', '#94a3b8'];
  
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
            <div className="text-center">
              <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No puppy data available to display gender distribution.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} puppies`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenderDistributionChart;
