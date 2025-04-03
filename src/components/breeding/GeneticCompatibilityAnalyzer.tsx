
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, AlertCircle, Dna } from 'lucide-react';
import { useBreedingCompatibility } from '@/hooks/useBreedingCompatibility';
import { Skeleton } from '@/components/ui/skeleton';

interface GeneticCompatibilityAnalyzerProps {
  sireId: string;
  damId: string;
}

const GeneticCompatibilityAnalyzer: React.FC<GeneticCompatibilityAnalyzerProps> = ({ 
  sireId, 
  damId 
}) => {
  const { 
    compatibilityResult, 
    isLoading, 
    error,
    sire,
    dam
  } = useBreedingCompatibility(sireId, damId);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genetic Compatibility Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to analyze genetic compatibility: {error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!compatibilityResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genetic Compatibility Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>
              Genetic data is not available for one or both dogs. Please ensure genetic profiles are complete.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Function to get color class based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Function to get progress color class based on score
  const getProgressColorClass = (score: number) => {
    if (score >= 85) return 'bg-green-600';
    if (score >= 70) return 'bg-amber-600';
    return 'bg-red-600';
  };
  
  return (
    <Card className="overflow-hidden">
      <div className={`p-4 ${compatibilityResult.overallScore >= 85 ? 'bg-green-600' : compatibilityResult.overallScore >= 70 ? 'bg-amber-600' : 'bg-red-600'} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Dna className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-semibold">Overall Compatibility</h3>
          </div>
          <div>
            <span className="text-2xl font-bold">{compatibilityResult.overallScore}%</span>
          </div>
        </div>
      </div>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Dog Pair Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-medium mb-1">Sire</h4>
              <p className="text-sm">{sire?.name || 'Unknown'}</p>
              <p className="text-xs text-muted-foreground">{sire?.breed || 'Unknown breed'}</p>
            </div>
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-medium mb-1">Dam</h4>
              <p className="text-sm">{dam?.name || 'Unknown'}</p>
              <p className="text-xs text-muted-foreground">{dam?.breed || 'Unknown breed'}</p>
            </div>
          </div>
          
          {/* Key Scores */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Health Compatibility</span>
                <span className={`text-sm font-medium ${getScoreColorClass(compatibilityResult.healthScore)}`}>
                  {compatibilityResult.healthScore}%
                </span>
              </div>
              <Progress value={compatibilityResult.healthScore} className="h-2" indicatorClassName={getProgressColorClass(compatibilityResult.healthScore)} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Color Compatibility</span>
                <span className={`text-sm font-medium ${getScoreColorClass(compatibilityResult.colorCompatibility)}`}>
                  {compatibilityResult.colorCompatibility}%
                </span>
              </div>
              <Progress value={compatibilityResult.colorCompatibility} className="h-2" indicatorClassName={getProgressColorClass(compatibilityResult.colorCompatibility)} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Inbreeding Coefficient</span>
                <span className={`text-sm font-medium ${compatibilityResult.inbreedingCoefficient <= 0.0625 ? 'text-green-600' : compatibilityResult.inbreedingCoefficient <= 0.125 ? 'text-amber-600' : 'text-red-600'}`}>
                  {(compatibilityResult.inbreedingCoefficient * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={Math.min(100, compatibilityResult.inbreedingCoefficient * 400)} 
                className="h-2" 
                indicatorClassName={compatibilityResult.inbreedingCoefficient <= 0.0625 ? 'bg-green-600' : compatibilityResult.inbreedingCoefficient <= 0.125 ? 'bg-amber-600' : 'bg-red-600'} 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {compatibilityResult.inbreedingCoefficient <= 0.0625 
                  ? 'Good - Low inbreeding coefficient'
                  : compatibilityResult.inbreedingCoefficient <= 0.125
                    ? 'Moderate - Watch for inbreeding depression'
                    : 'High - Consider a different pairing'}
              </p>
            </div>
          </div>
          
          {/* Health Risks */}
          <div className="border rounded-md p-4">
            <h4 className="font-medium mb-3">Genetic Health Analysis</h4>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="flex flex-col items-center bg-red-50 p-2 rounded-md">
                <span className="text-sm">High Risk</span>
                <span className="text-xl font-bold text-red-600">{compatibilityResult.healthRisks.highRiskConditions.length}</span>
              </div>
              <div className="flex flex-col items-center bg-amber-50 p-2 rounded-md">
                <span className="text-sm">Carriers</span>
                <span className="text-xl font-bold text-amber-600">{compatibilityResult.healthRisks.carrierConditions.length}</span>
              </div>
              <div className="flex flex-col items-center bg-green-50 p-2 rounded-md">
                <span className="text-sm">Clear</span>
                <span className="text-xl font-bold text-green-600">{compatibilityResult.healthRisks.clearConditions.length}</span>
              </div>
            </div>
            
            {compatibilityResult.healthRisks.highRiskConditions.length > 0 && (
              <div className="mb-3">
                <h5 className="text-sm font-medium flex items-center mb-1">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
                  High Risk Conditions
                </h5>
                <div className="flex flex-wrap gap-1">
                  {compatibilityResult.healthRisks.highRiskConditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-800 border-red-200">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {compatibilityResult.healthRisks.carrierConditions.length > 0 && (
              <div className="mb-3">
                <h5 className="text-sm font-medium flex items-center mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mr-1" />
                  Carrier Conditions
                </h5>
                <div className="flex flex-wrap gap-1">
                  {compatibilityResult.healthRisks.carrierConditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {compatibilityResult.healthRisks.clearConditions.length > 0 && (
              <div>
                <h5 className="text-sm font-medium flex items-center mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  Clear Conditions
                </h5>
                <div className="flex flex-wrap gap-1">
                  {compatibilityResult.healthRisks.clearConditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-800 border-green-200">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Color Predictions */}
          <div className="border rounded-md p-4">
            <h4 className="font-medium mb-3">Predicted Puppy Colors</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {compatibilityResult.colorPredictions.map((prediction, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-12 h-12 rounded-full mb-2 border"
                    style={{ backgroundColor: prediction.hex }}
                  ></div>
                  <span className="text-sm font-medium">{prediction.color}</span>
                  <span className="text-xs text-muted-foreground">
                    {(prediction.probability * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommendations */}
          <div>
            <h4 className="font-medium mb-2">Breeding Recommendations</h4>
            <ul className="space-y-2">
              {compatibilityResult.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm border-l-2 pl-3 border-primary">
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneticCompatibilityAnalyzer;
