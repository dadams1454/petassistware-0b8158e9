
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
  Brush
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import CustomTooltip from './CustomTooltip';
import { WeightData } from './types';

interface ChartContentProps {
  data: WeightData[];
  onDataPointClick: (data: any) => void;
}

const ChartContent: React.FC<ChartContentProps> = ({ 
  data,
  onDataPointClick 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? "h-64" : "h-80"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={isMobile ? 
            { top: 5, right: 10, left: 0, bottom: 40 } : 
            { top: 5, right: 30, left: 20, bottom: 40 }
          }
          onClick={onDataPointClick}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: isMobile ? 10 : 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            label={isMobile ? 
              { value: 'oz', angle: -90, position: 'insideLeft', offset: -5 } : 
              { value: 'Weight (oz)', angle: -90, position: 'insideLeft' }
            }
            width={isMobile ? 40 : 60}
            tick={{ fontSize: isMobile ? 10 : 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3'}} />
          <Legend 
            wrapperStyle={isMobile ? { fontSize: '10px' } : undefined}
            layout={isMobile ? "horizontal" : "vertical"}
            verticalAlign={isMobile ? "bottom" : "middle"}
            align={isMobile ? "center" : "right"}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#2563eb" 
            strokeWidth={2} 
            activeDot={{ 
              r: isMobile ? 6 : 8, 
              onClick: (payload: any, event: any) => {
                if (event) {
                  // Fixed: Use event from recharts instead of e
                  event.stopPropagation();
                }
                if (payload && typeof payload === 'object') {
                  onDataPointClick({ activePayload: [{ payload }] });
                }
              }
            }} 
            name="Current Weight"
          />
          <Line 
            type="monotone" 
            dataKey="birthWeight" 
            stroke="#9333ea" 
            strokeWidth={2} 
            activeDot={{ r: isMobile ? 5 : 6 }} 
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
          {!isMobile && (
            <Brush 
              dataKey="name" 
              height={30} 
              stroke="#8884d8"
              startIndex={0}
              endIndex={Math.min(5, data.length - 1)}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartContent;
