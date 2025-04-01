
import React, { useMemo } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { LineChart, Line } from 'lucide-react';

interface HeatCycleChartProps {
  dogId: string;
  heatCycles: any[];
}

const HeatCycleChart: React.FC<HeatCycleChartProps> = ({ dogId, heatCycles }) => {
  // Process data for chart display
  const chartData = useMemo(() => {
    if (!heatCycles || heatCycles.length === 0) {
      return [];
    }
    
    return heatCycles.map(cycle => {
      const startDate = parseISO(cycle.start_date);
      const endDate = cycle.end_date ? parseISO(cycle.end_date) : new Date();
      const duration = differenceInDays(endDate, startDate);
      
      return {
        id: cycle.id,
        startDate,
        formattedStartDate: format(startDate, 'MMM d, yyyy'),
        duration,
        ongoing: !cycle.end_date
      };
    });
  }, [heatCycles]);
  
  // Calculate average cycle duration
  const averageDuration = useMemo(() => {
    if (chartData.length === 0) return 0;
    const completedCycles = chartData.filter(cycle => !cycle.ongoing);
    if (completedCycles.length === 0) return 0;
    
    const sum = completedCycles.reduce((acc, cycle) => acc + cycle.duration, 0);
    return Math.round(sum / completedCycles.length);
  }, [chartData]);
  
  // Calculate average time between cycles
  const averageInterval = useMemo(() => {
    if (chartData.length <= 1) return 0;
    
    const sortedData = [...chartData].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    let intervals = [];
    
    for (let i = 1; i < sortedData.length; i++) {
      const daysBetween = differenceInDays(
        sortedData[i].startDate,
        sortedData[i-1].startDate
      );
      intervals.push(daysBetween);
    }
    
    const sum = intervals.reduce((acc, interval) => acc + interval, 0);
    return Math.round(sum / intervals.length);
  }, [chartData]);
  
  // No data state
  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LineChart className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Cycle Data Available</h3>
        <p className="text-muted-foreground text-center max-w-sm mt-2">
          Record heat cycles to generate analysis and visualizations for better breeding management.
        </p>
      </div>
    );
  }
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border rounded-md p-3 shadow-md">
          <p className="font-medium">{data.formattedStartDate}</p>
          <p className="text-sm text-muted-foreground">
            Duration: <span className="font-medium">{data.duration} days</span>
          </p>
          {data.ongoing && (
            <p className="text-xs text-amber-500 mt-1">Cycle ongoing</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-card rounded-md border">
          <h4 className="text-sm font-medium text-muted-foreground">Average Cycle Duration</h4>
          <p className="text-2xl font-bold">{averageDuration} days</p>
        </div>
        <div className="p-3 bg-card rounded-md border">
          <h4 className="text-sm font-medium text-muted-foreground">Average Time Between Cycles</h4>
          <p className="text-2xl font-bold">{averageInterval} days</p>
        </div>
      </div>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedStartDate"
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Duration (days)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={averageDuration} stroke="#8884d8" strokeDasharray="3 3">
              <label position="insideBottomRight" value="Avg" fill="#8884d8" />
            </ReferenceLine>
            <Bar 
              dataKey="duration" 
              fill="#8884d8" 
              radius={[4, 4, 0, 0]}
              name="Duration"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HeatCycleChart;
