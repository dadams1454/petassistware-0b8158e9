
import React from 'react';
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { GenderCount } from './types';

interface ChartContentProps {
  data: GenderCount[];
}

const ChartContent: React.FC<ChartContentProps> = ({ data }) => {
  const isMobile = useIsMobile();
  const COLORS = ['#2563eb', '#db2777', '#94a3b8'];
  
  return (
    <div className={isMobile ? "h-60" : "h-64"}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={!isMobile}
            outerRadius={isMobile ? 60 : 80}
            fill="#8884d8"
            dataKey="value"
            label={isMobile ? 
              undefined : 
              ({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} puppies`, 'Count']} />
          <Legend 
            layout={isMobile ? "horizontal" : "vertical"}
            verticalAlign={isMobile ? "bottom" : "middle"}
            align={isMobile ? "center" : "right"}
            wrapperStyle={isMobile ? { fontSize: '10px', marginTop: '10px' } : undefined}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartContent;
