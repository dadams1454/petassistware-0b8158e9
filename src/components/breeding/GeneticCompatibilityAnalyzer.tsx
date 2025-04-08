
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Dna, 
  Info 
} from 'lucide-react';
import { useGeneticPairing } from '@/hooks/useGeneticPairing';

interface GeneticCompatibilityAnalyzerProps {
  sireId: string;
  damId: string;
}

const GeneticCompatibilityAnalyzer: React.FC<GeneticCompatibilityAnalyzerProps> = ({ 
  sireId,
  damId 
}) => {
  const { 
    hasData,
    isLoading,
    error,
    compatibilityScore,
    healthConcernCounts,
    inbreedingCoefficient 
  } = useGeneticPairing(sireId, damId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <Dna className="h-10 w-10 mx-auto mb-4 animate-pulse text-gray-400" />
            <p className="text-muted-foreground">Analyzing genetic compatibility...</p>
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
          Failed to analyze genetic compatibility. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasData) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Missing Data</AlertTitle>
        <AlertDescription>
          Complete genetic data is not available for one or both of the selected dogs.
        </AlertDescription>
      </Alert>
    );
  }

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Helper function to get progress color
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Dna className="h-5 w-5 mr-2" />
          Genetic Compatibility Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Compatibility Score */}
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Compatibility Score</h3>
              <span className={`text-sm font-bold ${getScoreColor(compatibilityScore)}`}>
                {compatibilityScore}/100
              </span>
            </div>
            <Progress 
              value={compatibilityScore} 
              max={100} 
              className={`h-2 ${getProgressColor(compatibilityScore)}`} 
            />
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded-md p-3 text-center">
              <div className="flex justify-center mb-1">
                <AlertCircle className={`h-5 w-5 ${healthConcernCounts.atRisk > 0 ? 'text-red-500' : 'text-gray-400'}`} />
              </div>
              <div className="text-xl font-bold">{healthConcernCounts.atRisk}</div>
              <div className="text-xs text-muted-foreground">At Risk</div>
            </div>
            
            <div className="border rounded-md p-3 text-center">
              <div className="flex justify-center mb-1">
                <AlertTriangle className={`h-5 w-5 ${healthConcernCounts.carrier > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
              </div>
              <div className="text-xl font-bold">{healthConcernCounts.carrier}</div>
              <div className="text-xs text-muted-foreground">Carrier</div>
            </div>
            
            <div className="border rounded-md p-3 text-center">
              <div className="flex justify-center mb-1">
                <CheckCircle className={`h-5 w-5 ${healthConcernCounts.clear > 0 ? 'text-green-500' : 'text-gray-400'}`} />
              </div>
              <div className="text-xl font-bold">{healthConcernCounts.clear}</div>
              <div className="text-xs text-muted-foreground">Clear</div>
            </div>
          </div>

          {/* Inbreeding coefficient */}
          <div>
            <h3 className="text-sm font-medium mb-1">Inbreeding Coefficient</h3>
            <div className="flex items-center">
              <span className="text-lg font-semibold">
                {(inbreedingCoefficient * 100).toFixed(2)}%
              </span>
              {inbreedingCoefficient > 0.125 && (
                <AlertTriangle className="h-4 w-4 ml-2 text-amber-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {inbreedingCoefficient < 0.03 
                ? "Low inbreeding coefficient - excellent genetic diversity"
                : inbreedingCoefficient < 0.125
                  ? "Moderate inbreeding coefficient - acceptable for breeding"
                  : "High inbreeding coefficient - consider genetic diversity concerns"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneticCompatibilityAnalyzer;
