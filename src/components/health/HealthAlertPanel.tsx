
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Check, 
  Activity, 
  Weight, 
  Droplets, 
  Utensils, 
  ThermometerOff,
  Eye
} from 'lucide-react';
import { useHealthAlerts } from '@/hooks/useHealthAlerts';
import { LoadingState } from '@/components/ui/standardized';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface HealthAlertPanelProps {
  dogId: string;
  dogName?: string;
  lookbackDays?: number;
}

export const HealthAlertPanel: React.FC<HealthAlertPanelProps> = ({ 
  dogId,
  dogName = 'this dog',
  lookbackDays = 30
}) => {
  const { toast } = useToast();
  const { 
    isLoading,
    error,
    generatedAlerts,
    existingAlerts,
    resolveAlert,
    addAlert,
    healthData
  } = useHealthAlerts({ dogId, lookbackDays });
  
  // Function to determine alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'weight_loss':
        return <Weight className="h-4 w-4" />;
      case 'abnormal_stool':
        return <Droplets className="h-4 w-4" />;
      case 'missed_meals':
        return <Utensils className="h-4 w-4" />;
      case 'temperature':
        return <ThermometerOff className="h-4 w-4" />;
      case 'abnormal_indicators':
        return <Eye className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  // Handle alert actions
  const handleResolveAlert = async (alertId: string) => {
    try {
      await resolveAlert(alertId);
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };
  
  // Create a new alert from generated alerts
  const handleCreateAlert = async (alert: any) => {
    try {
      await addAlert({
        type: alert.type,
        status: 'active',
        description: alert.description
      });
      
      toast({
        title: 'Alert saved',
        description: `${alert.title} has been added to health record`
      });
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };
  
  if (isLoading) {
    return <LoadingState message="Analyzing health data..." />;
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load health data: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }
  
  const allAlerts = [...existingAlerts, ...generatedAlerts];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-500" />
          Health Alerts
        </CardTitle>
        <CardDescription>
          Automated health monitoring for {dogName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allAlerts.length > 0 ? (
          <div className="space-y-4">
            {allAlerts.map((alert, index) => (
              <div 
                key={alert.id || `generated-${index}`} 
                className="p-3 border rounded-md bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-amber-600 dark:text-amber-400">
                      {getAlertIcon(alert.type || 'unknown')}
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-300">
                        {alert.title}
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        {alert.description}
                      </p>
                      
                      {alert.created_at && (
                        <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                          {new Date(alert.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    {alert.id ? (
                      // Database alert - can be resolved
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs bg-white dark:bg-amber-950"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                    ) : (
                      // Generated alert - can be saved
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 text-xs bg-white dark:bg-amber-950"
                        onClick={() => handleCreateAlert(alert)}
                      >
                        Save Alert
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="font-medium text-lg mb-1">No Health Alerts</h4>
            <p className="text-muted-foreground">
              No health concerns detected in the last {lookbackDays} days.
            </p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Health Data Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="p-2 border rounded-md text-center">
              <p className="text-xs text-muted-foreground">Health Checks</p>
              <p className="font-medium">{healthData?.indicators?.length || 0}</p>
            </div>
            <div className="p-2 border rounded-md text-center">
              <p className="text-xs text-muted-foreground">Care Activities</p>
              <p className="font-medium">{healthData?.careLogs?.length || 0}</p>
            </div>
            <div className="p-2 border rounded-md text-center">
              <p className="text-xs text-muted-foreground">Time Period</p>
              <p className="font-medium">{lookbackDays} days</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
