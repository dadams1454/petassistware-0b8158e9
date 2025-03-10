
import React from 'react';
import { BarChart3 } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Sample data for the breeding analytics chart
const breedingData = [
  { name: 'Successful Litters', value: 65, color: '#10b981' },
  { name: 'In Progress', value: 25, color: '#3b82f6' },
  { name: 'Planned', value: 10, color: '#8b5cf6' },
];

const BreedingAnalytics: React.FC = () => {
  return (
    <DashboardCard
      title="Breeding Analytics"
      subtitle="Overview of your breeding program performance"
      icon={<BarChart3 size={18} />}
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={breedingData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {breedingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default BreedingAnalytics;
