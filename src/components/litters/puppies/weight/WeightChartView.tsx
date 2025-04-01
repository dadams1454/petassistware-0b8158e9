
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { WeightRecord } from '@/types/puppyTracking';
import { format, differenceInDays } from 'date-fns';

interface WeightChartViewProps {
  weightRecords: WeightRecord[];
  displayUnit: 'oz' | 'g' | 'lbs' | 'kg';
}

const convertWeight = (weight: number, fromUnit: string, toUnit: string): number => {
  // Convert to grams first
  let weightInGrams = weight;
  if (fromUnit === 'oz') weightInGrams = weight * 28.35;
  if (fromUnit === 'lbs') weightInGrams = weight * 453.59;
  if (fromUnit === 'kg') weightInGrams = weight * 1000;
  
  // Convert from grams to target unit
  if (toUnit === 'g') return parseFloat(weightInGrams.toFixed(1));
  if (toUnit === 'oz') return parseFloat((weightInGrams / 28.35).toFixed(2));
  if (toUnit === 'lbs') return parseFloat((weightInGrams / 453.59).toFixed(2));
  if (toUnit === 'kg') return parseFloat((weightInGrams / 1000).toFixed(3));
  
  return weight;
};

const WeightChartView: React.FC<WeightChartViewProps> = ({ weightRecords, displayUnit }) => {
  // Sort records by date
  const sortedRecords = [...weightRecords].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Convert weights to the display unit
  const chartData = sortedRecords.map(record => {
    // Calculate the age in days if birth_date is available
    let ageInDays = 0;
    if (record.birth_date) {
      ageInDays = differenceInDays(new Date(record.date), new Date(record.birth_date));
    }
    
    return {
      date: format(new Date(record.date), 'MMM d, yyyy'),
      weight: convertWeight(record.weight, record.weight_unit, displayUnit),
      age: ageInDays || undefined
    };
  });
  
  const renderTooltip = (data: any) => {
    if (!data.active || !data.payload?.length) return null;
    
    const payload = data.payload[0].payload;
    
    return (
      <div className="bg-white p-3 shadow-md rounded-md border">
        <p className="font-medium text-sm">{payload.date}</p>
        <p className="text-sm">
          Weight: <span className="font-medium">{payload.weight} {displayUnit}</span>
        </p>
        {payload.age !== undefined && (
          <p className="text-sm">
            Age: <span className="font-medium">{payload.age} days</span>
          </p>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-full h-72">
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No weight records available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: `Weight (${displayUnit})`, angle: -90, position: 'insideLeft' }} />
            <Tooltip content={renderTooltip} />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name={`Weight (${displayUnit})`}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WeightChartView;
