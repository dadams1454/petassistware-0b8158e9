
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Info } from 'lucide-react';
import { ColorProbability } from '@/types/genetics';

interface PairingColorAnalysisProps {
  colorProbabilities: ColorProbability[];
}

const PairingColorAnalysis: React.FC<PairingColorAnalysisProps> = ({ colorProbabilities }) => {
  if (!colorProbabilities || colorProbabilities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Color Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No color data available</AlertTitle>
            <AlertDescription>
              Color genetics data is missing for one or both dogs. Consider genetic testing for color predictions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Sort colors by probability (high to low)
  const sortedColors = [...colorProbabilities].sort((a, b) => b.probability - a.probability);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedColors.map((colorData, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  {colorData.hex && (
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: colorData.hex }}
                    />
                  )}
                  <span>{colorData.color}</span>
                </div>
                <span className="font-medium">
                  {Math.round(colorData.probability * 100)}%
                </span>
              </div>
              <Progress 
                value={colorData.probability * 100} 
                className="h-2" 
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '--tw-progress-bar-color': colorData.hex || '#666666' 
                } as React.CSSProperties}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          <p>
            These color probabilities are estimates based on known genetics. Actual results may vary 
            due to complex inheritance patterns and the presence of modifying genes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PairingColorAnalysis;
