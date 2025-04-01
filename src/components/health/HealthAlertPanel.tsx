
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  ThermometerSnowflake,
  Thermometer
} from 'lucide-react';

interface HealthAlertPanelProps {
  dogId: string;
}

export const HealthAlertPanel: React.FC<HealthAlertPanelProps> = ({ dogId }) => {
  // We'll add real implementation later, this is just to resolve the import error
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Health Alerts</h3>
          </div>
          <Badge variant="outline" className="bg-gray-100">
            No active alerts
          </Badge>
        </div>
        
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Thermometer className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700 text-sm font-medium">Health Monitoring</AlertTitle>
          <AlertDescription className="text-blue-600 text-xs">
            No health alerts detected for this dog. Regular monitoring helps catch issues early.
          </AlertDescription>
        </Alert>
        
        <div className="text-center text-sm text-muted-foreground pt-1">
          <Button variant="ghost" className="h-auto p-0 text-xs">
            <Calendar className="mr-1 h-3 w-3" />
            Set up vaccination reminders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
