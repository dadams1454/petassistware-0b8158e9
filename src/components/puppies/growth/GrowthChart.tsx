
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { WeightRecord } from '@/types';

interface GrowthChartProps {
  weightData: WeightRecord[];
}

const GrowthChart: React.FC<GrowthChartProps> = ({ weightData }) => {
  // Calculate age from birth_date and date in the WeightRecord:
  const calculateAge = (record: WeightRecord): number => {
    if (record.age_days) return record.age_days;
    if (record.birth_date && record.date) {
      const birthDate = new Date(record.birth_date);
      const recordDate = new Date(record.date);
      const ageInDays = Math.floor((recordDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      return ageInDays;
    }
    return 0;
  };

  const data = weightData.map((record) => ({
    age: calculateAge(record),
    weight: record.weight,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="age" name="Age (days)" />
        <YAxis dataKey="weight" name="Weight" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GrowthChart;
