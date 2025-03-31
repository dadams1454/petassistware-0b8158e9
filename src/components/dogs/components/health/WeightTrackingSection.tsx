
import React from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Plus, TrendingUp } from 'lucide-react';
import { WeightRecord, WeightUnitEnum } from '@/types/health';

interface WeightTrackingSectionProps {
  dogId: string;
  weightHistory: WeightRecord[];
  growthStats?: any;
  onAddWeight: () => void;
  isLoading?: boolean;
}

const WeightTrackingSection: React.FC<WeightTrackingSectionProps> = ({
  dogId,
  weightHistory,
  growthStats,
  onAddWeight,
  isLoading = false
}) => {
  // Sort the weight records by date ascending
  const sortedData = [...weightHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Format date for chart display
  const chartData = sortedData.map(record => ({
    date: format(new Date(record.date), 'MMM d'),
    weight: record.weight,
    unit: record.unit || record.weight_unit
  }));

  // Format dates for display
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Weight Tracking</h3>
        <Button onClick={onAddWeight} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Weight
        </Button>
      </div>

      {/* Weight trend chart */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 pb-2">
          <CardTitle className="text-md">Weight Over Time</CardTitle>
          <CardDescription>Track your dog's growth and weight changes</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-64 mt-2">
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis 
                    label={{ 
                      value: chartData[0]?.unit || 'Weight', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }} 
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value} ${chartData[0]?.unit}`, 'Weight'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col h-full justify-center items-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mb-2" />
                <p>Add more weight entries to see a trend line</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Growth statistics */}
      {growthStats && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Growth Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Initial Weight</p>
                <p className="text-lg font-semibold">{growthStats.initialWeight.toFixed(2)} kg</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Current Weight</p>
                <p className="text-lg font-semibold">{growthStats.currentWeight.toFixed(2)} kg</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Total Gain</p>
                <p className="text-lg font-semibold">{growthStats.totalGain.toFixed(2)} kg</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-lg font-semibold">{growthStats.percentageGain.toFixed(1)}%</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="border p-3 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Per Day</p>
                <p className="font-medium">{growthStats.growthPerDay.toFixed(3)} kg</p>
              </div>
              <div className="border p-3 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Per Week</p>
                <p className="font-medium">{growthStats.growthPerWeek.toFixed(2)} kg</p>
              </div>
              <div className="border p-3 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Per Month</p>
                <p className="font-medium">{growthStats.growthPerMonth.toFixed(2)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weight history table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Weight History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((record, index) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>
                    {record.weight} {record.unit || record.weight_unit}
                  </TableCell>
                  <TableCell>
                    {record.percent_change ? (
                      <span className={record.percent_change > 0 ? "text-green-600" : "text-red-600"}>
                        {record.percent_change > 0 ? "+" : ""}{record.percent_change.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{record.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightTrackingSection;
