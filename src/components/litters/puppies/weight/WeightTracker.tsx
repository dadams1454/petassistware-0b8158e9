
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useWeightData } from '@/hooks/useWeightData';
import WeightForm from '@/components/puppies/growth/WeightForm';
import { WeightTrackerProps } from './types';
import { WeightUnit } from '@/types/health';

const WeightTracker: React.FC<WeightTrackerProps> = ({
  puppyId,
  birthDate,
  onAddSuccess
}) => {
  const { weightRecords, isLoading, addWeightRecord } = useWeightData({ puppyId });
  const [chartData, setChartData] = useState<any[]>([]);
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  
  // Format weight data for chart
  useEffect(() => {
    if (!weightRecords) return;
    
    const formattedData = weightRecords.map(record => {
      // Calculate age from birthDate and record.date if needed
      const age = birthDate && record.date ? 
        Math.floor((new Date(record.date).getTime() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24)) : 
        record.age_days || 0;
        
      return {
        date: new Date(record.date).toLocaleDateString(),
        weight: record.weight,
        age: age
      };
    });
    
    setChartData(formattedData);
  }, [weightRecords, birthDate]);
  
  const handleWeightSubmit = async (data: any) => {
    try {
      await addWeightRecord({
        weight: parseFloat(data.weight),
        weight_unit: data.weight_unit as WeightUnit,
        unit: data.weight_unit as WeightUnit, // For backward compatibility
        date: data.date,
        notes: data.notes,
        dog_id: '', // Empty string as it's required but we're tracking a puppy
        puppy_id: puppyId, // Add puppy_id as required
      });
      
      setIsAddingWeight(false);
      
      if (onAddSuccess) {
        onAddSuccess();
      }
      
      return true;
    } catch (error) {
      console.error('Error adding weight record:', error);
      return false;
    }
  };
  
  const handleCancelAdd = () => {
    setIsAddingWeight(false);
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
        onCancel={handleCancelAdd}
        defaultUnit="oz"
      />
    );
  }
  
  if (!weightRecords || weightRecords.length === 0) {
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
