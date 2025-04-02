
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { differenceInDays, format, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HeatCycle } from '@/types/reproductive';

interface HeatCycleChartProps {
  dogId: string;
  heatCycles: HeatCycle[];
}

const HeatCycleChart: React.FC<HeatCycleChartProps> = ({ dogId, heatCycles }) => {
  const chartData = React.useMemo(() => {
    if (!heatCycles || heatCycles.length === 0) {
      return [];
    }
    
    // Create a copy and sort by start date (oldest first)
    const sortedCycles = [...heatCycles].sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    
    return sortedCycles.map((cycle, index) => {
      const startDate = new Date(cycle.start_date);
      const cycleLength = cycle.cycle_length || 
        (cycle.end_date ? differenceInDays(new Date(cycle.end_date), startDate) : 0);
      
      // Calculate days between cycles
      let daysBetweenCycles = 0;
      if (index > 0) {
        const prevCycle = sortedCycles[index - 1];
        daysBetweenCycles = differenceInDays(startDate, new Date(prevCycle.start_date));
      }
      
      return {
        name: format(startDate, 'MMM yyyy'),
        cycleLength: cycleLength || 0,
        daysBetweenCycles: index === 0 ? 0 : Math.abs(daysBetweenCycles),
        startDate: format(startDate, 'MMM d, yyyy')
      };
    });
  }, [heatCycles]);
  
  // Calculate average cycle length
  const averageCycleInterval = React.useMemo(() => {
    if (chartData.length < 2) return null;
    
    const totalDays = chartData.slice(1).reduce((sum, data) => sum + data.daysBetweenCycles, 0);
    return Math.round(totalDays / (chartData.length - 1));
  }, [chartData]);
  
  if (heatCycles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No heat cycle data available
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={70}
        />
        <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'cycleLength') return [`${value} days`, 'Cycle Duration'];
            if (name === 'daysBetweenCycles') return [`${value} days`, 'Days Since Previous'];
            return [value, name];
          }}
          labelFormatter={(label, items) => {
            const item = items[0]?.payload;
            return item ? item.startDate : label;
          }}
        />
        <Legend />
        <Bar 
          dataKey="cycleLength" 
          name="Cycle Duration" 
          fill="#f43f5e" 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          dataKey="daysBetweenCycles" 
          name="Days Between Cycles" 
          fill="#3b82f6" 
          radius={[4, 4, 0, 0]} 
        />
        {averageCycleInterval && (
          <ReferenceLine 
            y={averageCycleInterval} 
            stroke="#10b981" 
            strokeDasharray="3 3"
            label={{ 
              value: `Avg: ${averageCycleInterval} days`, 
              position: 'right',
              fill: '#10b981',
              fontSize: 12
            }} 
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HeatCycleChart;
