
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
          <p className="text-muted-foreground">
            No color analysis data available. Complete genetic profiles are needed for both sire and dam.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Potential Puppy Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorProbabilities.map((colorProb, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 rounded-md border"
                  style={{ borderLeftColor: colorProb.hex || '#888', borderLeftWidth: '4px' }}
                >
                  <div className="flex-grow">
                    <div className="font-medium">{colorProb.color}</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(colorProb.probability * 100)}% probability
                    </div>
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: colorProb.hex || '#888' }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Color predictions are based on the genetic profiles of the dam and sire.
              Actual results may vary based on complex genetic interactions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PairingColorAnalysis;
