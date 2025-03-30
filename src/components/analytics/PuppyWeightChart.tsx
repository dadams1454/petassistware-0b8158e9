
import React, { useMemo } from 'react';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Puppy } from '@/types/litter'; // Import Puppy from our types file

interface WeightData {
  name: string;
  weight: number;
  birthWeight: number;
  litterAverage?: number;
  color: string | null;
}

interface PuppyWeightChartProps {
  puppies: Puppy[];
  title?: string;
}

const PuppyWeightChart: React.FC<PuppyWeightChartProps> = ({ 
  puppies,
  title = "Puppy Weight Comparison"
}) => {
  const chartData: WeightData[] = useMemo(() => {
    return puppies
      .filter(puppy => puppy.current_weight || puppy.birth_weight)
      .map(puppy => {
        // Handle different types for weight values
        const currentWeight = puppy.current_weight 
          ? (typeof puppy.current_weight === 'string' 
              ? parseFloat(puppy.current_weight) 
              : puppy.current_weight)
          : 0;
          
        const birthWeight = puppy.birth_weight 
          ? (typeof puppy.birth_weight === 'string' 
              ? parseFloat(puppy.birth_weight) 
              : puppy.birth_weight)
          : 0;
        
        return {
          name: puppy.name || `Puppy #${puppy.id.substring(0, 4)}`,
          weight: currentWeight,
          birthWeight: birthWeight,
          color: puppy.color
        };
      });
  }, [puppies]);

  // Calculate litter average for current weights
  const litterAverageData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    const totalWeight = chartData.reduce((sum, puppy) => sum + puppy.weight, 0);
    const averageWeight = totalWeight / chartData.length;
    
    return chartData.map(puppy => ({
      ...puppy,
      litterAverage: averageWeight
    }));
  }, [chartData]);

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
                No weight data available. Add puppy weights to see a comparison chart.
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
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={litterAverageData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                label={{ value: 'Weight (oz)', angle: -90, position: 'insideLeft' }}
                width={60}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'litterAverage') return [`${Number(value).toFixed(1)} oz`, 'Litter Average'];
                  if (name === 'birthWeight') return [`${Number(value).toFixed(1)} oz`, 'Birth Weight'];
                  return [`${Number(value).toFixed(1)} oz`, 'Current Weight'];
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#2563eb" 
                strokeWidth={2} 
                activeDot={{ r: 8 }} 
                name="Current Weight"
              />
              <Line 
                type="monotone" 
                dataKey="birthWeight" 
                stroke="#9333ea" 
                strokeWidth={2} 
                activeDot={{ r: 6 }} 
                name="Birth Weight"
              />
              <Line 
                type="monotone" 
                dataKey="litterAverage" 
                stroke="#16a34a" 
                strokeDasharray="5 5" 
                strokeWidth={2} 
                name="Litter Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppyWeightChart;
