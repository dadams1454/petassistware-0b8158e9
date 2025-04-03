
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { WeightRecord } from '@/types/puppyTracking';
import { WeightUnit } from '@/types/common';
import { convertWeight } from './weightUnits';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface WeightChartViewProps {
  puppyId: string;
  birthDate?: string;
  displayUnit?: WeightUnit;
  weightRecords?: WeightRecord[];
}

const WeightChartView: React.FC<WeightChartViewProps> = ({
  puppyId,
  birthDate,
  displayUnit = 'oz',
  weightRecords = []
}) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (weightRecords.length === 0) return;

    // Process data for chart
    const formattedData = weightRecords.map((record) => {
      // Get age in days if birthDate is provided
      let ageInDays = 0;
      if (birthDate && record.date) {
        const birthDateTime = new Date(birthDate).getTime();
        const recordDateTime = new Date(record.date).getTime();
        ageInDays = Math.floor((recordDateTime - birthDateTime) / (1000 * 60 * 60 * 24));
      }

      // Convert weight to display unit
      const convertedWeight = convertWeight(
        record.weight, 
        record.weight_unit || record.unit || 'oz', 
        displayUnit
      );

      return {
        date: record.date,
        weight: convertedWeight,
        notes: record.notes,
        age: ageInDays || record.age_days || 0,
        original: record
      };
    }).sort((a, b) => a.age - b.age);

    setChartData(formattedData);
  }, [weightRecords, displayUnit, birthDate]);

  if (weightRecords.length === 0) {
    return (
      <Alert variant="default" className="bg-muted/40">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>No weight records found for this puppy.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="age" 
            label={{ 
              value: 'Age (days)', 
              position: 'insideBottomRight', 
              offset: -10 
            }} 
          />
          <YAxis 
            label={{ 
              value: `Weight (${displayUnit})`, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' } 
            }} 
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(2)} ${displayUnit}`, 'Weight']}
            labelFormatter={(age) => `Age: ${age} days`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#8884d8" 
            name={`Puppy Weight (${displayUnit})`}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChartView;
