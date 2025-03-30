
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp } from 'lucide-react';
import { WeightRecord } from '@/types/health';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  NameType, 
  ValueType 
} from 'recharts/types/component/DefaultTooltipContent';

interface WeightTrackingSectionProps {
  weightHistory: WeightRecord[];
  growthStats: any;
  onAddWeight: () => void;
  isLoading?: boolean;
}

const WeightTrackingSection: React.FC<WeightTrackingSectionProps> = ({
  weightHistory,
  growthStats,
  onAddWeight,
  isLoading = false
}) => {
  // Prepare chart data - convert to consistent units (kg) for better visualization
  const chartData = weightHistory
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(record => {
      const weightInKg = convertToKg(record.weight, record.weight_unit);
      return {
        date: format(new Date(record.date), 'MMM d'),
        weight: weightInKg,
        originalWeight: record.weight,
        unit: record.weight_unit,
        formattedDate: format(new Date(record.date), 'MMM d, yyyy')
      };
    });
  
  // Custom formatter for tooltip that handles all value types correctly
  const weightFormatter = (value: ValueType, name: NameType) => {
    // Make sure we handle string values safely
    if (typeof value === 'number') {
      return [`${value.toFixed(2)} kg`, 'Weight'];
    }
    return [value, name];
  };
  
  // Custom label formatter handling tooltips safely
  const labelFormatter = (label: string) => {
    const dataPoint = chartData.find(item => item.date === label);
    return dataPoint 
      ? `${dataPoint.formattedDate}: ${dataPoint.originalWeight} ${dataPoint.unit}`
      : label;
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Weight Tracking</CardTitle>
          <Button size="sm" onClick={onAddWeight}>
            <Plus className="h-4 w-4 mr-2" />
            Add Weight
          </Button>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Weight Tracking</CardTitle>
        <Button size="sm" onClick={onAddWeight}>
          <Plus className="h-4 w-4 mr-2" />
          Add Weight
        </Button>
      </CardHeader>
      <CardContent>
        {weightHistory.length > 1 ? (
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  style={{ fontSize: '0.75rem' }} 
                />
                <YAxis 
                  style={{ fontSize: '0.75rem' }} 
                  domain={['dataMin - 0.2', 'dataMax + 0.2']}
                  label={{ 
                    value: 'Weight (kg)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: '0.75rem' }
                  }}
                />
                <Tooltip
                  formatter={weightFormatter}
                  labelFormatter={labelFormatter}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  name="Weight" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p>Not enough weight records to display a chart.</p>
            <p className="text-sm mt-1">Add at least two weight records to see growth trends.</p>
          </div>
        )}
        
        {growthStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-blue-50 dark:bg-blue-950/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-blue-600 font-medium">Current Weight</h3>
                  <p className="text-2xl font-bold mt-1">
                    {growthStats.currentWeight.toFixed(2)} kg
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last recorded weight
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 dark:bg-green-950/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-green-600 font-medium">Total Gain</h3>
                  <p className="text-2xl font-bold mt-1">
                    {growthStats.totalGain.toFixed(2)} kg
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {growthStats.percentageGain.toFixed(1)}% increase
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 dark:bg-amber-950/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-amber-600 font-medium flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Growth Rate
                  </h3>
                  <p className="text-2xl font-bold mt-1">
                    {growthStats.growthPerWeek.toFixed(2)} kg/week
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Over {growthStats.daysTracked} days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="font-medium mb-3">Weight History</h3>
          {weightHistory.length === 0 ? (
            <p className="text-muted-foreground text-sm">No weight records found</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium text-sm">Date</th>
                    <th className="px-4 py-2 text-right font-medium text-sm">Weight</th>
                    <th className="px-4 py-2 text-right font-medium text-sm">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {weightHistory
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record, index, array) => {
                      // Calculate weight change from previous record
                      let previousRecord = array[index + 1];
                      let change = null;
                      
                      if (previousRecord) {
                        const currentKg = convertToKg(record.weight, record.weight_unit);
                        const prevKg = convertToKg(previousRecord.weight, previousRecord.weight_unit);
                        change = currentKg - prevKg;
                      }
                      
                      return (
                        <tr key={record.id} className="border-t">
                          <td className="px-4 py-2 text-sm">
                            {format(new Date(record.date), 'MMM d, yyyy')}
                          </td>
                          <td className="px-4 py-2 text-sm text-right">
                            {record.weight} {record.weight_unit}
                          </td>
                          <td className="px-4 py-2 text-sm text-right">
                            {change !== null ? (
                              <span className={change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : ''}>
                                {change > 0 ? '+' : ''}{change.toFixed(2)} kg
                              </span>
                            ) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to convert weight to kg for consistent comparisons
const convertToKg = (weight: number, unit: string): number => {
  switch (unit) {
    case 'kg':
      return weight;
    case 'lbs':
      return weight * 0.453592;
    case 'g':
      return weight / 1000;
    case 'oz':
      return weight * 0.0283495;
    default:
      return weight;
  }
};

export default WeightTrackingSection;
