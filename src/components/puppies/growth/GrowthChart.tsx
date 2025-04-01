
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePuppyWeights } from '@/hooks/usePuppyWeights';
import { usePuppyBreedAverages } from '@/hooks/usePuppyBreedAverages';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { WeightData } from '@/types/puppyTracking';

interface GrowthChartProps {
  puppyId: string;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ puppyId }) => {
  const [activeView, setActiveView] = React.useState<'weight' | 'percentile'>('weight');
  
  // Fetch puppy weight records
  const {
    weights,
    isLoading: isLoadingWeights,
    error: weightsError
  } = usePuppyWeights(puppyId);
  
  // Fetch breed average data
  const {
    breedAverages,
    isLoading: isLoadingAverages,
    error: averagesError
  } = usePuppyBreedAverages(puppyId);
  
  const isLoading = isLoadingWeights || isLoadingAverages;
  const error = weightsError || averagesError;
  
  // Process weight data for chart
  const processedWeightData = React.useMemo(() => {
    if (!weights || weights.length === 0 || !weights[0].birth_date) return [];
    
    const birthDate = new Date(weights[0].birth_date);
    
    return weights.map(record => {
      const recordDate = new Date(record.date);
      const ageInDays = Math.floor((recordDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        age: ageInDays,
        weight: parseFloat(record.weight.toString()),
        unit: record.weight_unit,
        date: record.date
      };
    }).sort((a, b) => a.age - b.age);
  }, [weights]);
  
  // Combine puppy data with breed averages for comparison
  const combinedChartData = React.useMemo(() => {
    if (!processedWeightData.length || !breedAverages?.averageGrowthData) {
      return processedWeightData;
    }
    
    // Create a map of breed average data by age
    const averagesByAge = new Map<number, number>();
    breedAverages.averageGrowthData.forEach((item: WeightData) => {
      averagesByAge.set(item.age, item.weight);
    });
    
    // Combine puppy data with breed averages
    return processedWeightData.map(record => {
      const breedAverage = averagesByAge.get(record.age) || null;
      return {
        ...record,
        averageWeight: breedAverage
      };
    });
  }, [processedWeightData, breedAverages]);
  
  if (isLoading) {
    return <LoadingState message="Loading weight data..." />;
  }
  
  if (error) {
    return <ErrorState title="Error" message="Could not load weight data" />;
  }
  
  if (!weights || weights.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">No weight records found for this puppy.</p>
            <p className="text-sm">Add weight records to see the growth chart.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Growth Chart</CardTitle>
            <CardDescription>
              Track puppy weight progress over time
              {breedAverages?.breed ? ` compared to ${breedAverages.breed} average` : ''}
            </CardDescription>
          </div>
          
          <Tabs 
            value={activeView} 
            onValueChange={(v) => setActiveView(v as 'weight' | 'percentile')}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="percentile">Percentile</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedChartData}
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
                  position: 'insideBottomRight', 
                  offset: -5 
                }} 
              />
              <YAxis 
                label={{ 
                  value: `Weight (${processedWeightData[0]?.unit || 'lbs'})`, 
                  angle: -90, 
                  position: 'insideLeft' 
                }} 
              />
              <Tooltip 
                formatter={(value) => [`${value} ${processedWeightData[0]?.unit || 'lbs'}`, 'Weight']}
                labelFormatter={(age) => `Age: ${age} days`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                name="Puppy Weight"
                stroke="#4f46e5"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={{ strokeWidth: 2 }}
              />
              {breedAverages?.breed && (
                <Line
                  type="monotone"
                  dataKey="averageWeight"
                  name={`${breedAverages.breed} Average`}
                  stroke="#9ca3af"
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground">Current Weight</div>
            <div className="text-xl font-semibold">
              {processedWeightData[processedWeightData.length - 1]?.weight || '-'} 
              {processedWeightData[0]?.unit || 'lbs'}
            </div>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground">Age</div>
            <div className="text-xl font-semibold">
              {processedWeightData[processedWeightData.length - 1]?.age || '-'} days
            </div>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-muted-foreground">Records</div>
            <div className="text-xl font-semibold">
              {processedWeightData.length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;
