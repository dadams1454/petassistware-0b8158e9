
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Plus, Thermometer, Activity, Droplets } from 'lucide-react';
import { format } from 'date-fns';
import { useHealthIndicators } from '@/hooks/useHealthIndicators';
import { AppetiteLevelEnum, EnergyLevelEnum, StoolConsistencyEnum } from '@/types/health';

interface HealthIndicatorDashboardProps {
  dogId: string;
  onAddClick: () => void;
}

const HealthIndicatorDashboard: React.FC<HealthIndicatorDashboardProps> = ({ dogId, onAddClick }) => {
  const [activeTab, setActiveTab] = useState('recent');
  const { 
    indicators,
    recentIndicators,
    abnormalIndicators,
    healthAlerts,
    isLoading,
    isLoadingRecent,
    isLoadingAbnormal,
    isLoadingAlerts,
    deleteIndicator,
    resolveAlert,
    getAppetiteLevelLabel,
    getEnergyLevelLabel,
    getStoolConsistencyLabel,
    hasActiveAlerts
  } = useHealthIndicators(dogId);

  const renderLoading = () => (
    <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const renderEmptyState = (message: string) => (
    <div className="text-center py-10">
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add Health Indicator
      </Button>
    </div>
  );

  const renderVitalSigns = (indicator: any) => (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {indicator.temperature && (
        <div className="flex items-center">
          <Thermometer className="h-4 w-4 mr-2 text-rose-500" />
          <span className="text-sm">
            Temperature: <span className="font-medium">{indicator.temperature}°F</span>
          </span>
        </div>
      )}
      {indicator.heart_rate && (
        <div className="flex items-center">
          <Activity className="h-4 w-4 mr-2 text-red-500" />
          <span className="text-sm">
            Heart Rate: <span className="font-medium">{indicator.heart_rate} bpm</span>
          </span>
        </div>
      )}
      {indicator.respiration_rate && (
        <div className="flex items-center">
          <Droplets className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm">
            Resp. Rate: <span className="font-medium">{indicator.respiration_rate}/min</span>
          </span>
        </div>
      )}
    </div>
  );

  const renderHealthStatus = (indicator: any) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {indicator.appetite && (
        <div className="text-sm">
          <span className="text-muted-foreground">Appetite:</span>{' '}
          <span className="font-medium">{getAppetiteLevelLabel(indicator.appetite)}</span>
        </div>
      )}
      {indicator.energy_level && (
        <div className="text-sm">
          <span className="text-muted-foreground">Energy Level:</span>{' '}
          <span className="font-medium">{getEnergyLevelLabel(indicator.energy_level)}</span>
        </div>
      )}
      {indicator.stool_consistency && (
        <div className="text-sm">
          <span className="text-muted-foreground">Stool:</span>{' '}
          <span className="font-medium">{getStoolConsistencyLabel(indicator.stool_consistency)}</span>
        </div>
      )}
    </div>
  );

  const renderIndicatorCard = (indicator: any) => (
    <Card key={indicator.id} className={indicator.abnormal ? 'border-amber-300' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-base">Health Check</CardTitle>
          <span className="text-sm text-muted-foreground">
            {format(new Date(indicator.date), 'MMM d, yyyy')}
          </span>
        </div>
        <CardDescription>
          {indicator.abnormal && (
            <div className="flex items-center text-amber-500 mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Abnormal indicators detected</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderVitalSigns(indicator)}
        {renderHealthStatus(indicator)}
        {indicator.notes && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">{indicator.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => deleteIndicator(indicator.id)}
          disabled={isLoading}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Health Indicators</h3>
        <Button onClick={onAddClick} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Record Health Indicator
        </Button>
      </div>

      {hasActiveAlerts && (
        <Card className="border-amber-400 bg-amber-50 dark:bg-amber-950">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              <CardTitle className="text-base text-amber-700 dark:text-amber-300">Active Health Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {healthAlerts
                .filter(alert => !alert.resolved)
                .map(alert => (
                  <li key={alert.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-amber-700 dark:text-amber-300">
                        {format(new Date(alert.created_at), 'MMM d, yyyy')} - Abnormal health indicators detected
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => resolveAlert(alert.id)}
                      className="border-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800"
                    >
                      Resolve
                    </Button>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="abnormal">Abnormal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="pt-4">
          {isLoadingRecent ? (
            renderLoading()
          ) : recentIndicators.length === 0 ? (
            renderEmptyState("No recent health indicators recorded")
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {recentIndicators.map(indicator => renderIndicatorCard(indicator))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="abnormal" className="pt-4">
          {isLoadingAbnormal ? (
            renderLoading()
          ) : abnormalIndicators.length === 0 ? (
            renderEmptyState("No abnormal health indicators recorded")
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {abnormalIndicators.map(indicator => renderIndicatorCard(indicator))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthIndicatorDashboard;
