
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { WeightRecord } from './types';
import { calculatePercentChange, convertWeight } from './weightUnits';

interface WeightChartProps {
  weights: WeightRecord[];
  isLoading: boolean;
}

const WeightChart: React.FC<WeightChartProps> = ({ weights, isLoading }) => {
  const [displayUnit, setDisplayUnit] = useState<string>('oz');
  
  // Prepare chart data
  const chartData = weights.map(record => {
    // Convert weight to the selected display unit
    const displayWeight = convertWeight(record.weight, record.weight_unit, displayUnit);
    
    return {
      date: format(new Date(record.date), 'MMM d'),
      fullDate: format(new Date(record.date), 'MMM d, yyyy'),
      weight: Number(displayWeight.toFixed(2)),
      unit: displayUnit
    };
  }).sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  // Calculate and add growth rate
  const enhancedData = chartData.map((item, index, array) => {
    if (index === 0) {
      return { ...item, growthRate: 0 };
    }
    
    const previousWeight = array[index - 1].weight;
    const growthRate = calculatePercentChange(item.weight, previousWeight);
    
    return {
      ...item,
      growthRate: Number(growthRate.toFixed(1))
    };
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-60">
            <p className="text-muted-foreground">Loading weight data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (weights.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center h-60 border border-dashed rounded-md">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No weight records found.</p>
            <p className="text-sm text-muted-foreground mt-1">Add weight records to see growth charts.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{payload[0]?.payload.fullDate}</p>
          <p className="text-sm">
            <span className="font-medium">Weight:</span> {payload[0]?.value} {payload[0]?.payload.unit}
          </p>
          {payload[1]?.value !== undefined && (
            <p className="text-sm">
              <span className="font-medium">Growth Rate:</span> {payload[1]?.value}%
            </p>
          )}
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Weight Progress</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Units:</span>
            <Tabs 
              value={displayUnit}
              onValueChange={setDisplayUnit}
              className="h-8"
            >
              <TabsList className="h-8">
                <TabsTrigger value="oz" className="px-2 h-7">oz</TabsTrigger>
                <TabsTrigger value="g" className="px-2 h-7">g</TabsTrigger>
                <TabsTrigger value="lbs" className="px-2 h-7">lbs</TabsTrigger>
                <TabsTrigger value="kg" className="px-2 h-7">kg</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weight" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="growth">Growth Rate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weight">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={enhancedData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}`}
                    label={{ 
                      value: displayUnit, 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#2563eb" 
                    strokeWidth={2} 
                    dot={{ r: 5 }} 
                    activeDot={{ r: 8 }}
                    name={`Weight (${displayUnit})`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="growth">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={enhancedData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`}
                    label={{ 
                      value: '% Change', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="growthRate" 
                    stroke="#16a34a" 
                    strokeWidth={2} 
                    dot={{ r: 5 }} 
                    activeDot={{ r: 8 }}
                    name="Growth Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeightChart;
