import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, LineChart, BadgeAlert, CalendarPlus } from 'lucide-react';
import { useHealthIndicators } from '@/hooks/useHealthIndicators';
import HealthIndicatorDialog from './HealthIndicatorDialog';
import {
  HealthIndicatorRecord,
  AppetiteLevelEnum,
  EnergyLevelEnum,
  StoolConsistencyEnum
} from '@/types/health';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface HealthIndicatorDashboardProps {
  dogId: string;
}

// Helper to prepare chart data
const prepareChartData = (indicators: HealthIndicatorRecord[]) => {
  const sortedData = [...indicators].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return sortedData.map(record => {
    // Convert enum values to numeric values for charting
    const appetiteValue = record.appetite ? 
      Object.keys(AppetiteLevelEnum).indexOf(record.appetite) : undefined;
    
    const energyValue = record.energy ? 
      Object.keys(EnergyLevelEnum).indexOf(record.energy) : undefined;
    
    const stoolValue = record.stool_consistency ? 
      Object.keys(StoolConsistencyEnum).indexOf(record.stool_consistency) : undefined;
    
    return {
      date: format(new Date(record.date), 'MM/dd'),
      appetiteValue,
      energyValue,
      stoolValue,
      abnormal: record.abnormal
    };
  });
};

const HealthIndicatorDashboard: React.FC<HealthIndicatorDashboardProps> = ({ dogId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { 
    recentIndicators, 
    abnormalIndicators,
    healthAlerts,
    isLoadingRecent,
    isLoadingAbnormal,
    isLoadingAlerts,
    resolveAlert,
    getAppetiteLevelLabel,
    getEnergyLevelLabel,
    getStoolConsistencyLabel,
    hasActiveAlerts
  } = useHealthIndicators(dogId);
  
  const chartData = prepareChartData(recentIndicators);
  
  // Get latest indicator record
  const latestIndicator = recentIndicators.length > 0 ? recentIndicators[0] : null;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Health Indicators</h3>
        <Button onClick={() => setDialogOpen(true)}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Record Health Indicators
        </Button>
      </div>
      
      {hasActiveAlerts && (
        <Alert variant="destructive" className="border-red-500 bg-red-50">
          <BadgeAlert className="h-4 w-4" />
          <AlertTitle>Health Alerts</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              {healthAlerts
                .filter(alert => !alert.resolved)
                .map(alert => (
                  <div key={alert.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">
                        Alert on {format(new Date(alert.created_at), 'MMM d, yyyy')}:
                      </span> {alert.health_indicators?.notes || 'Abnormal health indicators detected'}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                ))
              }
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Latest Indicators</CardTitle>
            <CardDescription>
              {latestIndicator ? format(new Date(latestIndicator.date), 'MMM d, yyyy') : 'No data recorded'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecent ? (
              <div className="h-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : latestIndicator ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Appetite:</span>
                  <Badge 
                    variant={latestIndicator.appetite === AppetiteLevelEnum.Poor || 
                            latestIndicator.appetite === AppetiteLevelEnum.None ? 'destructive' : 'outline'}
                  >
                    {latestIndicator.appetite ? getAppetiteLevelLabel(latestIndicator.appetite) : 'Not recorded'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Energy:</span>
                  <Badge 
                    variant={latestIndicator.energy === EnergyLevelEnum.Low || 
                            latestIndicator.energy === EnergyLevelEnum.VeryLow ? 'destructive' : 'outline'}
                  >
                    {latestIndicator.energy ? getEnergyLevelLabel(latestIndicator.energy) : 'Not recorded'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Stool:</span>
                  <Badge 
                    variant={latestIndicator.stool_consistency === StoolConsistencyEnum.Loose || 
                            latestIndicator.stool_consistency === StoolConsistencyEnum.Watery ||
                            latestIndicator.stool_consistency === StoolConsistencyEnum.Bloody ||
                            latestIndicator.stool_consistency === StoolConsistencyEnum.Mucousy ? 'destructive' : 'outline'}
                  >
                    {latestIndicator.stool_consistency ? 
                      getStoolConsistencyLabel(latestIndicator.stool_consistency) : 'Not recorded'}
                  </Badge>
                </div>
                {latestIndicator.notes && (
                  <div className="mt-4 pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Notes:</span>
                    <p className="text-sm mt-1">{latestIndicator.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
                No health indicators recorded
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setDialogOpen(true)}
            >
              <Activity className="h-4 w-4 mr-2" />
              Record New Data
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Health Indicators Trends (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRecent ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : chartData.length > 1 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="appetiteValue" 
                      name="Appetite" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energyValue" 
                      name="Energy" 
                      stroke="#82ca9d" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stoolValue" 
                      name="Stool" 
                      stroke="#ffc658" 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
                Need at least two data points to show trends
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <HealthIndicatorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dogId={dogId}
      />
    </div>
  );
};

export default HealthIndicatorDashboard;
