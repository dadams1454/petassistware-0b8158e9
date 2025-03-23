
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
  Cell
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { ColorCount } from './types';

interface ChartContentProps {
  data: ColorCount[];
  colors: string[];
}

const ChartContent: React.FC<ChartContentProps> = ({ data, colors }) => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "h-60" : "h-64"}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartContent;
