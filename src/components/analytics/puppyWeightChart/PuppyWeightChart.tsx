
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoomIn } from 'lucide-react';
import { useChartData } from './useChartData';
import ChartContent from './ChartContent';
import EmptyState from './EmptyState';
import PuppyDetailDialog from './PuppyDetailDialog';
import { PuppyWeightChartProps, WeightData } from './types';

const PuppyWeightChart: React.FC<PuppyWeightChartProps> = ({ 
  puppies,
  title = "Puppy Weight Comparison"
}) => {
  const [selectedPuppy, setSelectedPuppy] = useState<WeightData | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { litterAverageData, hasData } = useChartData(puppies);

  // Handle chart click to show puppy details
  const handleDataPointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedPuppy = data.activePayload[0].payload;
      setSelectedPuppy(clickedPuppy);
      setDetailDialogOpen(true);
    }
  };

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
        
        {!hasData ? (
          <EmptyState />
        ) : (
          <ChartContent 
            data={litterAverageData} 
            onDataPointClick={handleDataPointClick}
          />
        )}
      </Card>

      <PuppyDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        selectedPuppy={selectedPuppy}
      />
    </>
  );
};

export default PuppyWeightChart;
