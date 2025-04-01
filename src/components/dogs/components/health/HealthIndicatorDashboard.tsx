
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  AlertTriangle, 
  Check, 
  Info 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useHealthIndicators } from '@/hooks/useHealthIndicators';
import { HealthIndicator } from '@/services/healthIndicatorService';
import { AppetiteLevelEnum, EnergyLevelEnum, StoolConsistencyEnum } from '@/types/health';

interface HealthIndicatorDashboardProps {
  dogId: string;
  onAddClick: () => void;
}

const HealthIndicatorDashboard: React.FC<HealthIndicatorDashboardProps> = ({
  dogId,
  onAddClick
}) => {
  const [activeTab, setActiveTab] = useState('all');
  
  const { 
    indicators, 
    isLoading, 
    deleteIndicator, 
    isDeleting 
  } = useHealthIndicators(dogId);
  
  // Helper functions for labels
  const getAppetiteLevelLabel = (level: string | null) => {
    if (!level) return 'Not recorded';
    
    switch (level) {
      case AppetiteLevelEnum.Excellent: return 'Excellent';
      case AppetiteLevelEnum.Good: return 'Good';
      case AppetiteLevelEnum.Fair: return 'Fair';
      case AppetiteLevelEnum.Poor: return 'Poor';
      case AppetiteLevelEnum.None: return 'None';
      default: return level;
    }
  };
  
  const getEnergyLevelLabel = (level: string | null) => {
    if (!level) return 'Not recorded';
    
    switch (level) {
      case EnergyLevelEnum.VeryHigh: return 'Very High';
      case EnergyLevelEnum.High: return 'High';
      case EnergyLevelEnum.Normal: return 'Normal';
      case EnergyLevelEnum.Low: return 'Low';
      case EnergyLevelEnum.VeryLow: return 'Very Low';
      default: return level;
    }
  };
  
  const getStoolConsistencyLabel = (consistency: string | null) => {
    if (!consistency) return 'Not recorded';
    
    switch (consistency) {
      case StoolConsistencyEnum.Solid: return 'Solid';
      case StoolConsistencyEnum.SemiSolid: return 'Semi-Solid';
      case StoolConsistencyEnum.Soft: return 'Soft';
      case StoolConsistencyEnum.Loose: return 'Loose';
      case StoolConsistencyEnum.Watery: return 'Watery';
      case StoolConsistencyEnum.Bloody: return 'Bloody';
      case StoolConsistencyEnum.Mucousy: return 'Mucousy';
      default: return consistency;
    }
  };
  
  const handleDelete = async (indicatorId: string) => {
    if (confirm('Are you sure you want to delete this health indicator?')) {
      const result = await deleteIndicator(indicatorId);
      if (result) {
        toast({
          title: 'Health indicator deleted',
          description: 'The health indicator has been successfully deleted.',
        });
      }
    }
  };
  
  // Filter indicators based on active tab
  const filteredIndicators = indicators?.filter(indicator => {
    if (activeTab === 'all') return true;
    if (activeTab === 'abnormal') return indicator.abnormal;
    return false;
  }) || [];
  
  // Check if there are any abnormal indicators
  const hasAbnormalIndicators = indicators?.some(indicator => indicator.abnormal) || false;
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p>Loading health indicators...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Health Indicators</CardTitle>
            <CardDescription>
              Track and monitor your dog's daily health indicators
            </CardDescription>
          </div>
          <Button onClick={onAddClick}>Record Indicators</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Indicators</TabsTrigger>
            <TabsTrigger value="abnormal" className="relative">
              Abnormal
              {hasAbnormalIndicators && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="pt-2">
            {filteredIndicators.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Info className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>No health indicators recorded yet.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onAddClick}
                  className="mt-4"
                >
                  Record your first indicator
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIndicators.map((indicator: HealthIndicator) => (
                  <Card key={indicator.id} className={`overflow-hidden ${indicator.abnormal ? 'border-red-300 bg-red-50 dark:bg-red-950/20' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">
                          {format(new Date(indicator.date), 'MMMM d, yyyy')}
                        </div>
                        
                        <div className="flex space-x-2">
                          {indicator.abnormal && (
                            <Badge variant="destructive" className="flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Abnormal
                            </Badge>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(indicator.id)}
                            disabled={isDeleting}
                            className="h-7 px-2 text-destructive hover:text-destructive/80"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Appetite</p>
                          <p className={`text-sm font-medium ${
                            indicator.appetite === AppetiteLevelEnum.Poor || 
                            indicator.appetite === AppetiteLevelEnum.None 
                              ? 'text-red-600 dark:text-red-400' 
                              : ''
                          }`}>
                            {getAppetiteLevelLabel(indicator.appetite)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Energy Level</p>
                          <p className={`text-sm font-medium ${
                            indicator.energy === EnergyLevelEnum.Low || 
                            indicator.energy === EnergyLevelEnum.VeryLow 
                              ? 'text-red-600 dark:text-red-400' 
                              : ''
                          }`}>
                            {getEnergyLevelLabel(indicator.energy)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Stool Consistency</p>
                          <p className={`text-sm font-medium ${
                            indicator.stool_consistency === StoolConsistencyEnum.Loose || 
                            indicator.stool_consistency === StoolConsistencyEnum.Watery ||
                            indicator.stool_consistency === StoolConsistencyEnum.Bloody ||
                            indicator.stool_consistency === StoolConsistencyEnum.Mucousy
                              ? 'text-red-600 dark:text-red-400' 
                              : ''
                          }`}>
                            {getStoolConsistencyLabel(indicator.stool_consistency)}
                          </p>
                        </div>
                      </div>
                      
                      {indicator.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="text-sm">{indicator.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="abnormal" className="pt-2">
            {filteredIndicators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Check className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No abnormal indicators found. Great news!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIndicators.map((indicator: HealthIndicator) => (
                  <Card key={indicator.id} className="border-red-300 bg-red-50 dark:bg-red-950/20 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">
                          {format(new Date(indicator.date), 'MMMM d, yyyy')}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Badge variant="destructive" className="flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Abnormal
                          </Badge>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(indicator.id)}
                            disabled={isDeleting}
                            className="h-7 px-2 text-destructive hover:text-destructive/80"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Appetite</p>
                          <p className={`text-sm font-medium ${
                            indicator.appetite === AppetiteLevelEnum.Poor || 
                            indicator.appetite === AppetiteLevelEnum.None 
                              ? 'text-red-600 dark:text-red-400' 
                              : ''
                          }`}>
                            {getAppetiteLevelLabel(indicator.appetite)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Energy Level</p>
                          <p className={`text-sm font-medium ${
                            indicator.energy === EnergyLevelEnum.Low || 
                            indicator.energy === EnergyLevelEnum.VeryLow 
                              ? 'text-red-600 dark:text-red-400' 
                              : ''
                          }`}>
                            {getEnergyLevelLabel(indicator.energy)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Stool Consistency</p>
                          <p className={`text-sm font-medium ${
                            indicator.stool_consistency === StoolConsistencyEnum.Loose || 
                            indicator.stool_consistency === StoolConsistencyEnum.Watery ||
                            indicator.stool_consistency === StoolConsistencyEnum.Bloody ||
                            indicator.stool_consistency === StoolConsistencyEnum.Mucousy
                              ? 'text-red-600 dark:text-red-400' 
                              : ''
                          }`}>
                            {getStoolConsistencyLabel(indicator.stool_consistency)}
                          </p>
                        </div>
                      </div>
                      
                      {indicator.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="text-sm">{indicator.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HealthIndicatorDashboard;
