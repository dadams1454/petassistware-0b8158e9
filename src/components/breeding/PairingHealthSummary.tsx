
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface PairingHealthSummaryProps {
  healthRisks: Record<string, { status: string; probability: number }>;
}

const PairingHealthSummary: React.FC<PairingHealthSummaryProps> = ({ healthRisks }) => {
  // Count health risks by status
  const healthCounts = {
    atRisk: 0,
    carrier: 0,
    clear: 0,
    unknown: 0
  };

  // Organize health risks by status for display
  const organizedRisks = {
    atRisk: [] as Array<{ condition: string; probability: number }>,
    carrier: [] as Array<{ condition: string; probability: number }>,
    clear: [] as Array<{ condition: string; probability: number }>,
    unknown: [] as Array<{ condition: string; probability: number }>
  };

  // Process health risks
  Object.entries(healthRisks).forEach(([condition, { status, probability }]) => {
    if (status === 'at_risk' || status === 'affected') {
      healthCounts.atRisk++;
      organizedRisks.atRisk.push({ condition, probability });
    } else if (status === 'carrier') {
      healthCounts.carrier++;
      organizedRisks.carrier.push({ condition, probability });
    } else if (status === 'clear') {
      healthCounts.clear++;
      organizedRisks.clear.push({ condition, probability });
    } else {
      healthCounts.unknown++;
      organizedRisks.unknown.push({ condition, probability });
    }
  });

  // Helper to display risk conditions
  const renderRiskSection = (
    risks: Array<{ condition: string; probability: number }>,
    title: string,
    icon: React.ReactNode,
    variant: 'default' | 'destructive' | 'outline'
  ) => {
    if (risks.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <div className="space-y-2">
          {risks.map(({ condition, probability }) => (
            <Alert key={condition} variant={variant}>
              <div className="flex justify-between items-center">
                <AlertTitle>{condition}</AlertTitle>
                <Badge variant={variant}>
                  {Math.round(probability * 100)}%
                </Badge>
              </div>
              <AlertDescription>
                {getDescriptionForStatus(condition, probability, title.toLowerCase())}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </div>
    );
  };

  // Helper to generate descriptions for each risk
  const getDescriptionForStatus = (condition: string, probability: number, status: string) => {
    switch (status) {
      case 'at risk':
        return `There is a ${Math.round(probability * 100)}% chance that puppies will be affected by ${condition}.`;
      case 'carrier':
        return `There is a ${Math.round(probability * 100)}% chance that puppies will be carriers for ${condition}.`;
      case 'clear':
        return `Puppies are unlikely to be affected by or carriers for ${condition}.`;
      default:
        return `Insufficient data to determine risk for ${condition}.`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.keys(healthRisks).length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No health data available</AlertTitle>
            <AlertDescription>
              Genetic health data is missing for one or both dogs. Consider genetic testing to assess health risks.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Display counts summary */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center p-2 border rounded">
                <div className="text-red-500 font-bold text-lg">{healthCounts.atRisk}</div>
                <div className="text-xs">At Risk</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-yellow-500 font-bold text-lg">{healthCounts.carrier}</div>
                <div className="text-xs">Carrier</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-green-500 font-bold text-lg">{healthCounts.clear}</div>
                <div className="text-xs">Clear</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-gray-500 font-bold text-lg">{healthCounts.unknown}</div>
                <div className="text-xs">Unknown</div>
              </div>
            </div>

            {/* Render each risk category */}
            {renderRiskSection(
              organizedRisks.atRisk, 
              'At Risk Conditions', 
              <AlertCircle className="h-5 w-5 text-red-500" />, 
              'destructive'
            )}
            {renderRiskSection(
              organizedRisks.carrier, 
              'Carrier Status', 
              <AlertTriangle className="h-5 w-5 text-yellow-500" />, 
              'outline'
            )}
            {renderRiskSection(
              organizedRisks.clear, 
              'Clear Conditions', 
              <CheckCircle className="h-5 w-5 text-green-500" />, 
              'default'
            )}
            {renderRiskSection(
              organizedRisks.unknown, 
              'Unknown Status', 
              <Info className="h-5 w-5 text-gray-500" />, 
              'outline'
            )}

            {/* Health testing recommendation */}
            {healthCounts.unknown > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Health Testing Recommended</AlertTitle>
                <AlertDescription>
                  Complete genetic health testing is recommended for both dogs to get a full health risk assessment.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PairingHealthSummary;
