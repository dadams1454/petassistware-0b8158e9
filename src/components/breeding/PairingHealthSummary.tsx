
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface PairingHealthSummaryProps {
  healthRisks: Record<string, { status: string; probability: number }> | null;
}

const PairingHealthSummary: React.FC<PairingHealthSummaryProps> = ({ healthRisks }) => {
  if (!healthRisks || Object.keys(healthRisks).length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <Shield className="h-10 w-10 mb-4 mx-auto text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Health Data Available</h3>
            <p className="text-muted-foreground">
              Health risk analysis requires genetic testing data for both dogs.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Count risks by category
  const atRiskCount = Object.values(healthRisks).filter(r => r.status === 'at_risk').length;
  const carrierCount = Object.values(healthRisks).filter(r => r.status === 'carrier').length;
  const clearCount = Object.values(healthRisks).filter(r => r.status === 'clear').length;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={atRiskCount > 0 ? "border-red-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <AlertCircle className={`h-5 w-5 mr-2 ${atRiskCount > 0 ? "text-red-500" : "text-gray-400"}`} />
              At Risk Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{atRiskCount}</div>
            <p className="text-sm text-muted-foreground">
              {atRiskCount === 0 
                ? "No at-risk conditions detected" 
                : `${atRiskCount} condition${atRiskCount !== 1 ? 's' : ''} with high risk`}
            </p>
          </CardContent>
        </Card>
        
        <Card className={carrierCount > 0 ? "border-amber-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <AlertTriangle className={`h-5 w-5 mr-2 ${carrierCount > 0 ? "text-amber-500" : "text-gray-400"}`} />
              Carrier Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{carrierCount}</div>
            <p className="text-sm text-muted-foreground">
              {carrierCount === 0 
                ? "No carrier conditions detected" 
                : `Carriers for ${carrierCount} condition${carrierCount !== 1 ? 's' : ''}`}
            </p>
          </CardContent>
        </Card>
        
        <Card className={clearCount > 0 ? "border-green-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <CheckCircle className={`h-5 w-5 mr-2 ${clearCount > 0 ? "text-green-500" : "text-gray-400"}`} />
              Clear Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clearCount}</div>
            <p className="text-sm text-muted-foreground">
              {clearCount === 0 
                ? "No clear conditions detected" 
                : `Clear for ${clearCount} condition${clearCount !== 1 ? 's' : ''}`}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detailed Health Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(healthRisks).map(([condition, data]) => (
              <div key={condition} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  {data.status === 'at_risk' && <AlertCircle className="h-4 w-4 text-red-500 mr-2" />}
                  {data.status === 'carrier' && <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />}
                  {data.status === 'clear' && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                  <span className="text-sm font-medium">{formatConditionName(condition)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm mr-2">
                    {(data.probability * 100).toFixed(0)}% probability
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(data.status)}`}>
                    {formatStatus(data.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions
const formatConditionName = (condition: string): string => {
  return condition
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatStatus = (status: string): string => {
  switch (status) {
    case 'at_risk':
      return 'At Risk';
    case 'carrier':
      return 'Carrier';
    case 'clear':
      return 'Clear';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const getStatusColorClass = (status: string): string => {
  switch (status) {
    case 'at_risk':
      return 'bg-red-100 text-red-800';
    case 'carrier':
      return 'bg-amber-100 text-amber-800';
    case 'clear':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default PairingHealthSummary;
