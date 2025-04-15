
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Plus, Thermometer, Activity, Droplets } from 'lucide-react';
import { format } from 'date-fns';
import { useHealthIndicators } from '@/hooks/useHealthIndicators';

interface HealthIndicatorDashboardProps {
  dogId: string;
  onAddClick: () => void;
}

const HealthIndicatorDashboard: React.FC<HealthIndicatorDashboardProps> = ({ dogId, onAddClick }) => {
  const [activeTab, setActiveTab] = useState('recent');
  const { 
    healthIndicators,
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
          <div className="mt-4 text-sm">
            <span className="text-muted-foreground">Notes:</span>
            <p className="mt-1">{indicator.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex justify-end w-full">
          <Button variant="ghost" size="sm" onClick={() => deleteIndicator(indicator.id)}>
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="recent">Recent</TabsTrigger>
        <TabsTrigger value="abnormal" className="relative">
          Abnormal
          {hasActiveAlerts && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="all">All Indicators</TabsTrigger>
      </TabsList>

      <TabsContent value="recent">
        <div className="mt-4 space-y-4">
          {isLoadingRecent ? (
            renderLoading()
          ) : recentIndicators.length === 0 ? (
            renderEmptyState("No recent health indicators")
          ) : (
            recentIndicators.map(renderIndicatorCard)
          )}
        </div>
      </TabsContent>

      <TabsContent value="abnormal">
        <div className="mt-4 space-y-4">
          {isLoadingAbnormal ? (
            renderLoading()
          ) : abnormalIndicators.length === 0 ? (
            renderEmptyState("No abnormal health indicators")
          ) : (
            abnormalIndicators.map(renderIndicatorCard)
          )}
        </div>
      </TabsContent>

      <TabsContent value="all">
        <div className="mt-4 space-y-4">
          {isLoading ? (
            renderLoading()
          ) : healthIndicators.length === 0 ? (
            renderEmptyState("No health indicators recorded")
          ) : (
            healthIndicators.map(renderIndicatorCard)
          )}
        </div>
      </TabsContent>

      <div className="flex justify-end mt-6">
        <Button onClick={onAddClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Health Indicator
        </Button>
      </div>
    </Tabs>
  );
};

export default HealthIndicatorDashboard;
