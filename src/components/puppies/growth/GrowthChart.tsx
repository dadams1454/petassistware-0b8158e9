
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useWeightData } from '@/hooks/useWeightData';
import { WeightData } from '@/types/puppyTracking';

interface GrowthChartProps {
  puppyId: string;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ puppyId }) => {
  const [displayUnit, setDisplayUnit] = useState<'oz' | 'g' | 'lbs' | 'kg'>('oz');
  const { weightData, isLoading } = useWeightData(puppyId);
  const [chartData, setChartData] = useState<Array<any>>([]);
  
  // Process weight data for the chart
  useEffect(() => {
    if (!weightData) return;
    
    const processedData = weightData.map(record => {
      // Calculate age in days if birth_date is available
      let ageInDays = 0;
      if (record.birth_date) {
        const birthDate = new Date(record.birth_date).getTime();
        const recordDate = new Date(record.date).getTime();
        ageInDays = Math.floor((recordDate - birthDate) / (1000 * 60 * 60 * 24));
      }
      
      return {
        date: new Date(record.date).toLocaleDateString(),
        weight: record.weight,
        unit: record.weight_unit || record.unit || 'oz',
        age: ageInDays
      };
    });
    
    setChartData(processedData);
  }, [weightData]);
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!weightData || weightData.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center items-center h-64 text-center">
            <div>
              <p className="text-muted-foreground mb-2">No weight data recorded yet</p>
              <p className="text-xs text-muted-foreground">Add weight records to see growth chart</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Chart</CardTitle>
        <CardDescription>Track puppy weight over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="age" 
                label={{ value: 'Age in Days', position: 'insideBottomRight', offset: 0 }} 
              />
              <YAxis 
                label={{ value: `Weight (${displayUnit})`, angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Weight" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;
