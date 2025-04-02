
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useWeightData } from '@/hooks/useWeightData';
import WeightForm from '@/components/puppies/growth/WeightForm';

interface WeightTrackerProps {
  puppyId: string;
  birthDate?: string;
  isAddingWeight?: boolean;
  onCancelAdd?: () => void;
  onWeightAdded?: () => void;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({
  puppyId,
  birthDate,
  isAddingWeight = false,
  onCancelAdd,
  onWeightAdded
}) => {
  const { weightData, isLoading, addWeightRecord } = useWeightData(puppyId);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Format weight data for chart
  useEffect(() => {
    if (!weightData) return;
    
    const formattedData = weightData.map(record => {
      return {
        date: new Date(record.date).toLocaleDateString(),
        weight: record.weight,
        age: record.age || 0
      };
    });
    
    setChartData(formattedData);
  }, [weightData]);
  
  const handleWeightSubmit = async (data: any) => {
    try {
      await addWeightRecord({
        weight: parseFloat(data.weight),
        weight_unit: data.weight_unit,
        date: data.date,
        notes: data.notes,
        birth_date: birthDate
      });
      
      if (onWeightAdded) {
        onWeightAdded();
      }
      
      return true;
    } catch (error) {
      console.error('Error adding weight record:', error);
      return false;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isAddingWeight) {
    return (
      <WeightForm
        puppyId={puppyId}
        birthDate={birthDate}
        onSubmit={handleWeightSubmit}
        onCancel={onCancelAdd || (() => {})}
        defaultUnit="oz"
      />
    );
  }
  
  if (!weightData || weightData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-2">No weight records found</p>
      </div>
    );
  }
  
  return (
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
            label={{ value: 'Age (days)', position: 'insideBottomRight', offset: 0 }}
          />
          <YAxis 
            label={{ value: 'Weight (oz)', angle: -90, position: 'insideLeft' }}
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
  );
};

export default WeightTracker;
