
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeatCycle } from '@/types/heat-cycles';

interface HeatCycleVisualizerProps {
  cycles: HeatCycle[];
  activeCycleId?: string;
}

const HeatCycleVisualizer: React.FC<HeatCycleVisualizerProps> = ({ cycles, activeCycleId }) => {
  if (!cycles || cycles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Heat Cycle Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 text-muted-foreground">
            No heat cycle data available to visualize
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort cycles by start date
  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Heat Cycle Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative h-16 w-full">
            {sortedCycles.map((cycle) => {
              const start = new Date(cycle.start_date);
              const end = cycle.end_date ? new Date(cycle.end_date) : null;
              
              // Calculate intensity color
              const getIntensityColor = () => {
                switch (cycle.intensity?.toLowerCase()) {
                  case 'high':
                    return 'bg-red-500';
                  case 'medium':
                    return 'bg-orange-400';
                  case 'low':
                    return 'bg-yellow-300';
                  default:
                    return 'bg-gray-300';
                }
              };
              
              const isActive = cycle.id === activeCycleId;
              
              return (
                <div 
                  key={cycle.id}
                  className="absolute h-8 rounded-md cursor-pointer transition-all hover:opacity-90 hover:h-10"
                  style={{ 
                    left: '10%',
                    width: '80%',
                    top: isActive ? '0' : '20%',
                  }}
                  title={`Cycle ${cycle.cycle_number || ''}: ${start.toLocaleDateString()} - ${end?.toLocaleDateString() || 'Ongoing'}`}
                >
                  <div className={`h-full w-full rounded-md ${getIntensityColor()} ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
                    <div className="px-2 text-xs text-white font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                      Cycle {cycle.cycle_number || ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-xs text-muted-foreground">
            {sortedCycles.length} {sortedCycles.length === 1 ? 'cycle' : 'cycles'} recorded
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatCycleVisualizer;
