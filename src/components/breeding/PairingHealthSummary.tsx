
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

interface HealthRisk {
  status: string;
  probability: number;
}

interface PairingHealthSummaryProps {
  healthRisks: Record<string, HealthRisk>;
}

const PairingHealthSummary: React.FC<PairingHealthSummaryProps> = ({ healthRisks }) => {
  if (!healthRisks || Object.keys(healthRisks).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No health data available</AlertTitle>
            <AlertDescription>
              Health genetics data is missing for one or both dogs. Consider genetic testing for health predictions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Count risks by status
  const statusCounts = Object.values(healthRisks).reduce(
    (counts, risk) => {
      const status = risk.status || 'unknown';
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );

  // Status display info with corrected badge variants
  const statusInfo: Record<string, { 
    label: string; 
    icon: React.ReactNode; 
    color: "default" | "destructive" | "outline" | "secondary" 
  }> = {
    at_risk: { label: 'At Risk', icon: <AlertTriangle className="h-4 w-4" />, color: "destructive" },
    carrier: { label: 'Carrier', icon: <AlertTriangle className="h-4 w-4" />, color: "secondary" },
    clear: { label: 'Clear', icon: <CheckCircle className="h-4 w-4" />, color: "default" },
    unknown: { label: 'Unknown', icon: <HelpCircle className="h-4 w-4" />, color: "outline" },
    affected: { label: 'Affected', icon: <AlertTriangle className="h-4 w-4" />, color: "destructive" }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Badge 
                key={status}
                variant={statusInfo[status]?.color || "default"}
                className="flex items-center gap-1"
              >
                {statusInfo[status]?.icon}
                {statusInfo[status]?.label || status}: {count}
              </Badge>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Health Conditions</h3>
            <ul className="space-y-2">
              {Object.entries(healthRisks).map(([condition, risk]) => (
                <li key={condition} className="flex justify-between items-center p-2 rounded bg-secondary/20">
                  <div className="flex items-center gap-2">
                    {statusInfo[risk.status]?.icon}
                    <span className="font-medium">{condition}</span>
                  </div>
                  <Badge variant={statusInfo[risk.status]?.color || "default"}>
                    {statusInfo[risk.status]?.label || risk.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              These health analyses are based on genetic markers. Consult with a veterinarian for 
              complete health assessments before breeding decisions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PairingHealthSummary;
