
import React from 'react';
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
import { format, parseISO, differenceInDays } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { WeightChartViewProps } from './types';
import { WeightRecord, WeightUnit } from '@/types/puppyTracking';
import { convertWeight } from './weightUnits';

const WeightChartView: React.FC<WeightChartViewProps> = ({ 
  weightRecords, 
  displayUnit 
}) => {
  const birthDate = weightRecords[0]?.birth_date 
    ? new Date(weightRecords[0].birth_date) 
    : null;

  // Convert weights to the display unit and format the data for the chart
  const chartData = weightRecords.map(record => {
    const recordDate = new Date(record.date);
    
    // Calculate age in days if birth date is available
    const ageInDays = birthDate 
      ? differenceInDays(recordDate, birthDate) 
      : null;
    
    // Convert weight to the display unit
    const convertedWeight = convertWeight(
      record.weight,
      record.weight_unit as WeightUnit,
      displayUnit
    );

    return {
      id: record.id,
      date: recordDate,
      weight: Number(convertedWeight.toFixed(2)),
      formattedDate: format(recordDate, 'MMM d, yyyy'),
      ageInDays: ageInDays,
      unit: displayUnit,
      notes: record.notes || ''
    };
  });

  if (weightRecords.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No weight records available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
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
            dataKey={chartData[0].ageInDays !== null ? "ageInDays" : "formattedDate"} 
            label={
              chartData[0].ageInDays !== null 
                ? { value: "Age (days)", position: "insideBottom", offset: -5 } 
                : { value: "Date", position: "insideBottom", offset: -5 }
            }
          />
          <YAxis 
            label={{ 
              value: `Weight (${displayUnit})`, 
              angle: -90, 
              position: 'insideLeft' 
            }} 
          />
          <Tooltip 
            formatter={(value, name) => [
              `${value} ${displayUnit}`, 
              name === "weight" ? "Weight" : name
            ]}
            labelFormatter={(label) => 
              chartData[0].ageInDays !== null 
                ? `Age: ${label} days` 
                : `Date: ${
                    chartData.find(item => 
                      item.ageInDays === label || 
                      item.formattedDate === label
                    )?.formattedDate
                  }`
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            name="Weight"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChartView;
