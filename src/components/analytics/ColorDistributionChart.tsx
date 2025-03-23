
import React, { useMemo } from 'react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ColorDistributionChartProps {
  puppies: Puppy[];
  title?: string;
}

const ColorDistributionChart: React.FC<ColorDistributionChartProps> = ({ 
  puppies,
  title = "Color Distribution"
}) => {
  const isMobile = useIsMobile();
  
  const chartData = useMemo(() => {
    const colorCounts: { [key: string]: number } = {};
    
    puppies.forEach(puppy => {
      if (puppy.color) {
        const color = puppy.color;
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      } else {
        colorCounts['Unknown'] = (colorCounts['Unknown'] || 0) + 1;
      }
    });
    
    return Object.keys(colorCounts).map(color => ({
      name: color,
      count: colorCounts[color]
    }));
  }, [puppies]);
  
  // Generate unique colors for bars
  const generateColors = (count: number) => {
    const baseColors = [
      '#2563eb', '#9333ea', '#16a34a', '#db2777', 
      '#ea580c', '#ca8a04', '#0891b2', '#4f46e5'
    ];
    
    return baseColors.slice(0, Math.min(count, baseColors.length));
  };
  
  const barColors = generateColors(chartData.length);
  
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
                No color data available for puppies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={isMobile ? "h-60" : "h-64"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={isMobile ? 
                { top: 5, right: 10, left: 0, bottom: 50 } : 
                { top: 5, right: 30, left: 20, bottom: 5 }
              }
              layout={isMobile ? "vertical" : "horizontal"}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {isMobile ? (
                <>
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 10 }}
                    width={70}
                  />
                </>
              ) : (
                <>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                  />
                </>
              )}
              <Tooltip 
                formatter={(value) => [`${value} puppies`, 'Count']}
              />
              <Legend 
                wrapperStyle={isMobile ? { fontSize: '10px' } : undefined}
                verticalAlign={isMobile ? "top" : "bottom"}
              />
              <Bar 
                dataKey="count" 
                name="Number of Puppies" 
                fill="#2563eb"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorDistributionChart;
