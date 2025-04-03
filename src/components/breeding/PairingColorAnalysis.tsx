
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { ColorProbability } from '@/types/genetics';

interface PairingColorAnalysisProps {
  colorProbabilities: ColorProbability[] | null;
}

const PairingColorAnalysis: React.FC<PairingColorAnalysisProps> = ({ colorProbabilities }) => {
  if (!colorProbabilities || colorProbabilities.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <Palette className="h-10 w-10 mb-4 mx-auto text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Color Data Available</h3>
            <p className="text-muted-foreground">
              Color probability analysis requires genetic data for both dogs.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Expected Puppy Color Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Color probability visualization */}
              <div>
                <h3 className="text-sm font-medium mb-3">Color Probability</h3>
                <div className="space-y-2">
                  {colorProbabilities.map((color, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{color.color}</span>
                        <span>{(color.probability * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-primary"
                          style={{ 
                            width: `${color.probability * 100}%`,
                            backgroundColor: color.hex || getColorHex(color.color)
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Color swatches */}
              <div>
                <h3 className="text-sm font-medium mb-3">Color Preview</h3>
                <div className="grid grid-cols-2 gap-3">
                  {colorProbabilities.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-16 h-16 rounded-full border mb-2"
                        style={{ backgroundColor: color.hex || getColorHex(color.color) }}
                      ></div>
                      <span className="text-xs">{color.color}</span>
                      <span className="text-xs text-muted-foreground">
                        {(color.probability * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Understanding Color Genetics</h3>
              <p className="text-sm text-muted-foreground">
                Dog color genetics are complex. These probabilities represent the estimated likelihood of each color
                based on the known genetic factors of the parents. Actual results may vary.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to provide hex values for common dog colors
const getColorHex = (colorName: string): string => {
  const colors: Record<string, string> = {
    'Black': '#222222',
    'Brown': '#8B4513',
    'Chocolate': '#7B3F00',
    'Liver': '#674C47',
    'Red': '#A52A2A',
    'Golden': '#DAA520',
    'Yellow': '#F0E68C',
    'Cream': '#FFFDD0',
    'White': '#FFFFFF',
    'Blue': '#6082B6',
    'Gray': '#808080',
    'Silver': '#C0C0C0',
    'Fawn': '#E5AA70',
    'Tan': '#D2B48C',
    'Sable': '#996633',
    'Brindle': '#664228',
    'Merle': '#6F8FAF',
    'Tri-color': '#8B4513',
    'Parti': '#FFD700',
    'Mixed': '#A0A0A0'
  };
  
  // Check for partial matches if exact match not found
  for (const [key, value] of Object.entries(colors)) {
    if (colorName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return '#A0A0A0'; // Default color for unknown colors
};

export default PairingColorAnalysis;
