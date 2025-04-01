
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePuppyWeightRecords } from '@/hooks/usePuppyWeightRecords';
import { usePuppyBreedAverages } from '@/hooks/usePuppyBreedAverages';
import { LoadingState } from '@/components/ui/standardized';

interface GrowthChartProps {
  puppyId: string;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ puppyId }) => {
  const { 
    weightRecords,
    isLoading: isWeightLoading
  } = usePuppyWeightRecords(puppyId);
  
  const {
    breedAverages,
    isLoading: isAveragesLoading
  } = usePuppyBreedAverages(puppyId);
  
  const isLoading = isWeightLoading || isAveragesLoading;
  
  if (isLoading) {
    return <LoadingState message="Loading growth data..." />;
  }
  
  // Prepare data for the chart
  const chartData = weightRecords?.map(record => {
    // Calculate age in days based on birth date
    const birthDate = record.birth_date ? new Date(record.birth_date) : null;
    const recordDate = new Date(record.date);
    const ageInDays = birthDate 
      ? Math.floor((recordDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)) 
      : 0;
    
    // Convert weight to consistent unit (lbs)
    let weightInLbs = record.weight;
    
    if (record.weight_unit === 'oz') {
      weightInLbs = record.weight / 16;
    } else if (record.weight_unit === 'g') {
      weightInLbs = record.weight / 453.59;
    } else if (record.weight_unit === 'kg') {
      weightInLbs = record.weight * 2.20462;
    }
    
    return {
      age: ageInDays,
      weight: parseFloat(weightInLbs.toFixed(2)),
      date: record.date
    };
  }) || [];
  
  // Combine with breed averages
  const combinedData = [];
  
  // First add all actual weight records
  for (const record of chartData) {
    // Find breed average for this age
    const averageForAge = breedAverages?.find(avg => avg.dayAge === record.age);
    
    combinedData.push({
      ...record,
      breedAverage: averageForAge ? averageForAge.weight : null
    });
  }
  
  // Then add breed averages without corresponding weight records
  for (const avg of breedAverages || []) {
    // Check if this age is already in the data
    const exists = combinedData.some(record => record.age === avg.dayAge);
    
    if (!exists) {
      combinedData.push({
        age: avg.dayAge,
        weight: null,
        breedAverage: avg.weight,
        date: null
      });
    }
  }
  
  // Sort by age
  combinedData.sort((a, b) => a.age - b.age);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Growth Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {combinedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={combinedData}
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
                  label={{ 
                    value: 'Age (days)', 
                    position: 'bottom', 
                    offset: 0 
                  }} 
                />
                <YAxis 
                  label={{ 
                    value: 'Weight (lbs)', 
                    angle: -90, 
                    position: 'insideLeft' 
                  }} 
                />
                <Tooltip 
                  formatter={(value: any) => [`${value} lbs`, '']}
                  labelFormatter={(label) => `Age: ${label} days`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Actual Weight"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="breedAverage"
                  name="Breed Average"
                  stroke="#82ca9d"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                No weight data available yet
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;
