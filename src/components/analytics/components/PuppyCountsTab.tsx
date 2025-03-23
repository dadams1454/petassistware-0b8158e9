
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PuppyCountsTabProps {
  isLoadingLitters: boolean;
  puppiesPerLitterData: any[];
}

const PuppyCountsTab: React.FC<PuppyCountsTabProps> = ({ 
  isLoadingLitters,
  puppiesPerLitterData 
}) => {
  if (isLoadingLitters) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading litter data...</p>
      </div>
    );
  }

  if (!puppiesPerLitterData.length) {
    return (
      <div className="text-center py-8 border border-dashed rounded-md">
        <p className="text-muted-foreground">No litter data available for this dam.</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={puppiesPerLitterData}
          margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis 
            label={{ value: 'Number of Puppies', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'male') return [`${value} males`, 'Males'];
              if (name === 'female') return [`${value} females`, 'Females'];
              return [`${value} puppies`, 'Total'];
            }}
            labelFormatter={(label) => {
              const item = puppiesPerLitterData.find(d => d.name === label);
              return `${label} (Sire: ${item?.sire})`;
            }}
          />
          <Legend />
          <Bar dataKey="male" name="Males" fill="#2563eb" />
          <Bar dataKey="female" name="Females" fill="#db2777" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PuppyCountsTab;
