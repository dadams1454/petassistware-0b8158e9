
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { getPredictedColors } from '@/services/colorPredictionService';
import { PuppyColorPrediction } from '@/types/colorGenetics';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ColorPredictionProps {
  breed: string | null | undefined;
  damColor: string | null | undefined;
  sireColor: string | null | undefined;
}

const ColorPrediction: React.FC<ColorPredictionProps> = ({ 
  breed, 
  damColor, 
  sireColor 
}) => {
  const [predictions, setPredictions] = useState<PuppyColorPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!breed || !damColor || !sireColor) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getPredictedColors(breed, damColor, sireColor);
        setPredictions(data);
      } catch (err) {
        console.error('Failed to fetch color predictions:', err);
        setError('Unable to fetch color predictions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [breed, damColor, sireColor]);

  // Don't show anything if we don't have the required data
  if (!breed || !damColor || !sireColor) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Coat Color Prediction</CardTitle>
        <CardDescription>
          Possible coat colors for puppies from this breeding pair
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Calculating predictions...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        ) : predictions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No color predictions available for this breeding pair.</p>
            <p className="text-sm mt-2">This may occur if the genetic data for these colors is not in our database.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full border"
                    style={{ 
                      backgroundColor: getColorCode(prediction.color_name),
                      borderColor: prediction.color_name.toLowerCase() === 'white' ? '#e2e8f0' : 'transparent'
                    }}
                  />
                  <div>
                    <span className="font-medium">{prediction.color_name}</span>
                    {prediction.is_akc_recognized ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CheckCircle className="inline-block ml-2 h-4 w-4 text-green-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>AKC Recognized Color</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="inline-block ml-2 h-4 w-4 text-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Not AKC Recognized</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {(prediction.probability * 100).toFixed(0)}%
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to get color codes
function getColorCode(colorName: string): string {
  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'Brown': '#654321',
    'Gray': '#808080',
    'Grey': '#808080',
    'Landseer': '#FFFFFF', // Simplified, actually black and white
    'White': '#FFFFFF',
    'Red': '#B22222',
    'Fawn': '#D2B48C',
    'Blue': '#4682B4',
    'Tan': '#D2B48C'
  };
  
  return colorMap[colorName] || '#CCCCCC';
}

export default ColorPrediction;
