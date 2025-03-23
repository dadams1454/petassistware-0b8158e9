
import React, { useMemo, useState } from 'react';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  TooltipProps
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, ZoomIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WeightData {
  name: string;
  weight: number;
  birthWeight: number;
  litterAverage?: number;
  color: string | null;
  id?: string;
  gender?: string;
}

interface PuppyWeightChartProps {
  puppies: Puppy[];
  title?: string;
}

// Custom tooltip component for detailed information
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;
  
  const data = payload[0]?.payload as WeightData;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 border rounded-md shadow-lg">
      <p className="font-medium text-sm">{label}</p>
      <div className="grid gap-1 mt-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">
              {entry.name}: 
            </span>
            <span className="text-sm font-medium">
              {Number(entry.value).toFixed(1)} oz
            </span>
          </div>
        ))}
      </div>
      {data.gender && (
        <p className="text-xs text-muted-foreground mt-2">
          Gender: {data.gender}
        </p>
      )}
    </div>
  );
};

const PuppyWeightChart: React.FC<PuppyWeightChartProps> = ({ 
  puppies,
  title = "Puppy Weight Comparison"
}) => {
  const [selectedPuppy, setSelectedPuppy] = useState<WeightData | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const chartData: WeightData[] = useMemo(() => {
    return puppies
      .filter(puppy => puppy.current_weight || puppy.birth_weight)
      .map(puppy => {
        // Handle different types for weight values
        const currentWeight = puppy.current_weight 
          ? (typeof puppy.current_weight === 'string' 
              ? parseFloat(puppy.current_weight) 
              : puppy.current_weight)
          : 0;
          
        const birthWeight = puppy.birth_weight 
          ? (typeof puppy.birth_weight === 'string' 
              ? parseFloat(puppy.birth_weight) 
              : puppy.birth_weight)
          : 0;
        
        return {
          name: puppy.name || `Puppy #${puppy.id.substring(0, 4)}`,
          weight: currentWeight,
          birthWeight: birthWeight,
          color: puppy.color,
          id: puppy.id,
          gender: puppy.gender
        };
      });
  }, [puppies]);

  // Calculate litter average for current weights
  const litterAverageData = useMemo(() => {
    if (chartData.length === 0) return [];
    
    const totalWeight = chartData.reduce((sum, puppy) => sum + puppy.weight, 0);
    const averageWeight = totalWeight / chartData.length;
    
    return chartData.map(puppy => ({
      ...puppy,
      litterAverage: averageWeight
    }));
  }, [chartData]);

  // Handle chart click to show puppy details
  const handleDataPointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedPuppy = data.activePayload[0].payload;
      setSelectedPuppy(clickedPuppy);
      setDetailDialogOpen(true);
    }
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
            <div className="text-center">
              <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No weight data available. Add puppy weights to see a comparison chart.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            {title}
            <span className="text-xs text-muted-foreground font-normal italic flex items-center">
              <ZoomIn className="h-3 w-3 mr-1" /> Click on data points for details
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={litterAverageData}
                margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
                onClick={handleDataPointClick}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  label={{ value: 'Weight (oz)', angle: -90, position: 'insideLeft' }}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3'}} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  activeDot={{ r: 8, onClick: (e, payload) => {
                    setSelectedPuppy(payload);
                    setDetailDialogOpen(true);
                  }}} 
                  name="Current Weight"
                />
                <Line 
                  type="monotone" 
                  dataKey="birthWeight" 
                  stroke="#9333ea" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                  name="Birth Weight"
                />
                <Line 
                  type="monotone" 
                  dataKey="litterAverage" 
                  stroke="#16a34a" 
                  strokeDasharray="5 5" 
                  strokeWidth={2} 
                  name="Litter Average"
                />
                <Brush 
                  dataKey="name" 
                  height={30} 
                  stroke="#8884d8"
                  startIndex={0}
                  endIndex={Math.min(5, litterAverageData.length - 1)}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Puppy Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Puppy Weight Details</DialogTitle>
          </DialogHeader>
          
          {selectedPuppy && (
            <div className="py-4">
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: selectedPuppy.color || '#888' }}
                />
                <h3 className="text-lg font-medium">{selectedPuppy.name}</h3>
                {selectedPuppy.gender && (
                  <span className="px-2 py-1 text-xs rounded-full bg-muted">
                    {selectedPuppy.gender}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Birth Weight</p>
                  <p className="text-lg font-medium">
                    {selectedPuppy.birthWeight.toFixed(1)} oz
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Weight</p>
                  <p className="text-lg font-medium">
                    {selectedPuppy.weight.toFixed(1)} oz
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Weight Gain</p>
                <p className="text-lg font-medium">
                  {(selectedPuppy.weight - selectedPuppy.birthWeight).toFixed(1)} oz
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedPuppy.litterAverage && (
                    <>Litter Average: {selectedPuppy.litterAverage.toFixed(1)} oz</>
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PuppyWeightChart;
