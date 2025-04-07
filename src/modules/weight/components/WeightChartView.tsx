
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { convertWeight } from '@/utils/weightConversion';
import { differenceInDays } from 'date-fns';
import { WeightChartViewProps } from '../types';

const WeightChartView: React.FC<WeightChartViewProps> = ({
  puppyId,
  dogId,
  birthDate,
  displayUnit,
  weightRecords
}) => {
  if (!weightRecords || weightRecords.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-muted-foreground">No weight data available to display</p>
        </CardContent>
      </Card>
    );
  }

  // Sort by date for the chart
  const sortedRecords = [...weightRecords].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Convert all weights to the selected display unit
  const formattedData = sortedRecords.map(record => {
    const convertedWeight = convertWeight(record.weight, record.weight_unit, displayUnit);
    
    // Calculate age in days if birthDate is provided
    let ageDays = record.age_days;
    if (!ageDays && birthDate && record.date) {
      const recordDate = new Date(record.date);
      const birthDateObj = new Date(birthDate);
      ageDays = differenceInDays(recordDate, birthDateObj);
    }
    
    return {
      date: record.date,
      weight: parseFloat(convertedWeight.toFixed(2)),
      ageDays
    };
  });

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={birthDate ? "ageDays" : "date"} 
            label={birthDate ? { value: 'Age (days)', position: 'insideBottomRight', offset: 0 } : {}} 
          />
          <YAxis 
            label={{ value: `Weight (${displayUnit})`, angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip 
            formatter={(value: number) => [`${value} ${displayUnit}`, 'Weight']}
            labelFormatter={(label) => birthDate ? `Age: ${label} days` : `Date: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name={`Weight (${displayUnit})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChartView;
