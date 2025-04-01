
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInDays, addDays } from 'date-fns';
import { AlertTriangle, Calendar, Activity } from 'lucide-react';

interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string | null;
  notes?: string | null;
}

interface HeatCycleChartProps {
  dogId: string;
  heatCycles: HeatCycle[];
}

interface ChartDataPoint {
  date: string;
  dayNumber: number;
  stage: string;
  notes?: string;
}

const HeatCycleChart: React.FC<HeatCycleChartProps> = ({ dogId, heatCycles }) => {
  if (!heatCycles || heatCycles.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium">No Heat Cycle Data</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Record heat cycles to view analytics and patterns.
        </p>
      </div>
    );
  }

  const prepareCycleData = (cycle: HeatCycle): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const startDate = new Date(cycle.start_date);
    const endDate = cycle.end_date ? new Date(cycle.end_date) : addDays(startDate, 21); // Default to 21 days if no end date
    
    const cycleDuration = differenceInDays(endDate, startDate);
    
    // Create data points for each day of the cycle
    for (let i = 0; i <= cycleDuration; i++) {
      const currentDate = addDays(startDate, i);
      const dayNumber = i + 1;
      
      // Determine cycle stage based on day number
      let stage = 'Unknown';
      if (dayNumber <= 9) {
        stage = 'Proestrus';
      } else if (dayNumber <= 13) {
        stage = 'Estrus';
      } else if (dayNumber <= 17) {
        stage = 'Diestrus';
      } else {
        stage = 'Anestrus';
      }
      
      data.push({
        date: format(currentDate, 'MMM d'),
        dayNumber,
        stage,
        notes: cycle.notes || undefined
      });
    }
    
    return data;
  };

  // Get the most recent cycle
  const sortedCycles = [...heatCycles].sort((a, b) => 
    new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
  
  const latestCycle = sortedCycles[0];
  const chartData = prepareCycleData(latestCycle);
  
  // Calculate average cycle length
  let avgCycleLength = 0;
  if (heatCycles.length > 1) {
    let totalLength = 0;
    let validCycles = 0;
    
    heatCycles.forEach(cycle => {
      if (cycle.end_date) {
        const length = differenceInDays(new Date(cycle.end_date), new Date(cycle.start_date));
        totalLength += length;
        validCycles++;
      }
    });
    
    if (validCycles > 0) {
      avgCycleLength = Math.round(totalLength / validCycles);
    }
  }

  const stageColors = {
    Proestrus: '#ef4444',  // Red
    Estrus: '#ec4899',     // Pink
    Diestrus: '#8b5cf6',   // Purple
    Anestrus: '#3b82f6',   // Blue
    Unknown: '#9ca3af'     // Gray
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Latest Heat Cycle</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{format(new Date(latestCycle.start_date), 'MMM d, yyyy')}</span>
            </div>
            {latestCycle.end_date && (
              <div className="text-xs text-muted-foreground mt-1">
                Duration: {differenceInDays(new Date(latestCycle.end_date), new Date(latestCycle.start_date))} days
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Cycles Recorded</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{heatCycles.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Avg. Cycle Length</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{avgCycleLength > 0 ? `${avgCycleLength} days` : 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              padding={{ left: 10, right: 10 }}
            />
            <YAxis domain={[0, 4]}>
              <Label 
                value="Cycle Stage" 
                angle={-90} 
                position="insideLeft" 
                style={{ textAnchor: 'middle', fill: 'var(--muted-foreground)' }}
              />
            </YAxis>
            <Tooltip 
              formatter={(value, name, props) => {
                if (name === 'stage') {
                  return [props.payload.stage, 'Stage'];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `Day: ${chartData.find(d => d.date === label)?.dayNumber}`}
            />
            <Legend />
            <Line 
              type="stepAfter" 
              dataKey="stage" 
              stroke="#8884d8" 
              name="Stage"
              strokeWidth={2}
              dot={{ r: 4 }}
              isAnimationActive={true}
              activeDot={{ r: 6, stroke: 'var(--primary)', strokeWidth: 2 }}
              // Map stage names to numeric values for the chart
              yAxisId={0}
              data={chartData.map(point => ({
                ...point,
                stage: point.stage === 'Proestrus' ? 1 : 
                       point.stage === 'Estrus' ? 2 : 
                       point.stage === 'Diestrus' ? 3 : 
                       point.stage === 'Anestrus' ? 4 : 0
              }))}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(stageColors).map(([stage, color]) => (
          <div key={stage} className="flex items-center">
            <div className="w-4 h-4 rounded mr-1" style={{ backgroundColor: color }}></div>
            <span className="text-xs">{stage}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatCycleChart;
