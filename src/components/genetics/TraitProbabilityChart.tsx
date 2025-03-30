
import React from 'react';
import { DogGenotype } from '@/types/genetics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateColorProbabilities } from './utils/geneticCalculations';
import { ColorProbabilityPieChart } from './components/ColorProbabilityPieChart';
import ChartLegend from './components/ChartLegend';
import { GenotypeInfoPanel } from './components/GenotypeInfoPanel';

interface TraitProbabilityChartProps {
  sireGenotype: DogGenotype;
  damGenotype: DogGenotype;
  traitType: 'color' | 'coat' | 'size' | 'all';
  title?: string;
}

export const TraitProbabilityChart: React.FC<TraitProbabilityChartProps> = ({
  sireGenotype,
  damGenotype,
  traitType,
  title = 'Offspring Color Probability'
}) => {
  const colorData = calculateColorProbabilities(sireGenotype, damGenotype);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ColorProbabilityPieChart colorData={colorData} />
        <ChartLegend data={colorData} />
        <GenotypeInfoPanel sireGenotype={sireGenotype} damGenotype={damGenotype} />
      </CardContent>
    </Card>
  );
};

export default TraitProbabilityChart;
