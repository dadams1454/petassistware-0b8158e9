
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  HealthIndicatorRecord, 
  AppetiteLevelEnum, 
  EnergyLevelEnum, 
  StoolConsistencyEnum 
} from '@/types/health';
import { 
  getHealthIndicators, 
  addHealthIndicator, 
  updateHealthIndicator, 
  deleteHealthIndicator,
  getRecentHealthIndicators,
  getAbnormalHealthIndicators,
  getHealthAlerts,
  resolveHealthAlert
} from '@/services/healthIndicatorService';

export const useHealthIndicators = (dogId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all health indicators
  const { 
    data: healthIndicators = [], 
    isLoading: isLoadingIndicators, 
    error: indicatorsError, 
    refetch: refetchIndicators 
  } = useQuery({
    queryKey: ['healthIndicators', dogId],
    queryFn: () => getHealthIndicators(dogId),
    enabled: !!dogId,
  });
  
  // Fetch recent health indicators (last 7 days)
  const { 
    data: recentIndicators = [], 
    isLoading: isLoadingRecent, 
    error: recentError 
  } = useQuery({
    queryKey: ['recentHealthIndicators', dogId],
    queryFn: () => getRecentHealthIndicators(dogId),
    enabled: !!dogId,
  });
  
  // Fetch abnormal health indicators
  const { 
    data: abnormalIndicators = [], 
    isLoading: isLoadingAbnormal, 
    error: abnormalError 
  } = useQuery({
    queryKey: ['abnormalHealthIndicators', dogId],
    queryFn: () => getAbnormalHealthIndicators(dogId),
    enabled: !!dogId,
  });
  
  // Fetch health alerts
  const { 
    data: healthAlerts = [], 
    isLoading: isLoadingAlerts, 
    error: alertsError,
    refetch: refetchAlerts 
  } = useQuery({
    queryKey: ['healthAlerts', dogId],
    queryFn: () => getHealthAlerts(dogId),
    enabled: !!dogId,
  });

  // Add a new health indicator record
  const addIndicator = useMutation({
    mutationFn: (record: Omit<HealthIndicatorRecord, 'id' | 'created_at'>) => 
      addHealthIndicator(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthIndicators', dogId] });
      queryClient.invalidateQueries({ queryKey: ['recentHealthIndicators', dogId] });
      queryClient.invalidateQueries({ queryKey: ['abnormalHealthIndicators', dogId] });
      queryClient.invalidateQueries({ queryKey: ['healthAlerts', dogId] });
      toast({
        title: 'Health indicator added',
        description: 'The health indicator has been successfully recorded',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add health indicator',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update an existing health indicator
  const updateIndicator = useMutation({
    mutationFn: ({ id, ...updates }: { id: string; [key: string]: any }) => 
      updateHealthIndicator(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthIndicators', dogId] });
      queryClient.invalidateQueries({ queryKey: ['recentHealthIndicators', dogId] });
      queryClient.invalidateQueries({ queryKey: ['abnormalHealthIndicators', dogId] });
      toast({
        title: 'Health indicator updated',
        description: 'The health indicator has been successfully updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update health indicator',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete a health indicator
  const deleteIndicator = useMutation({
    mutationFn: (id: string) => deleteHealthIndicator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthIndicators', dogId] });
      queryClient.invalidateQueries({ queryKey: ['recentHealthIndicators', dogId] });
      queryClient.invalidateQueries({ queryKey: ['abnormalHealthIndicators', dogId] });
      toast({
        title: 'Health indicator deleted',
        description: 'The health indicator has been successfully deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete health indicator',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Resolve a health alert
  const resolveAlert = useMutation({
    mutationFn: (alertId: string) => resolveHealthAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthAlerts', dogId] });
      toast({
        title: 'Alert resolved',
        description: 'The health alert has been successfully resolved',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to resolve alert',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Get the most recent health indicator
  const getMostRecentIndicator = () => {
    if (recentIndicators.length === 0) return null;
    return recentIndicators[0];
  };

  // Helper to check if dog has active alerts
  const hasActiveAlerts = healthAlerts.some(alert => !alert.resolved);
  
  // Get human-readable labels for enum values
  const getAppetiteLevelLabel = (level: AppetiteLevelEnum): string => {
    const labels = {
      [AppetiteLevelEnum.Excellent]: 'Excellent',
      [AppetiteLevelEnum.Good]: 'Good',
      [AppetiteLevelEnum.Fair]: 'Fair',
      [AppetiteLevelEnum.Poor]: 'Poor',
      [AppetiteLevelEnum.None]: 'None'
    };
    return labels[level] || 'Unknown';
  };
  
  const getEnergyLevelLabel = (level: EnergyLevelEnum): string => {
    const labels = {
      [EnergyLevelEnum.VeryHigh]: 'Very High',
      [EnergyLevelEnum.High]: 'High',
      [EnergyLevelEnum.Normal]: 'Normal',
      [EnergyLevelEnum.Low]: 'Low',
      [EnergyLevelEnum.VeryLow]: 'Very Low'
    };
    return labels[level] || 'Unknown';
  };
  
  const getStoolConsistencyLabel = (consistency: StoolConsistencyEnum): string => {
    const labels = {
      [StoolConsistencyEnum.Solid]: 'Solid',
      [StoolConsistencyEnum.SemiSolid]: 'Semi-Solid',
      [StoolConsistencyEnum.Soft]: 'Soft',
      [StoolConsistencyEnum.Loose]: 'Loose',
      [StoolConsistencyEnum.Watery]: 'Watery',
      [StoolConsistencyEnum.Bloody]: 'Bloody',
      [StoolConsistencyEnum.Mucousy]: 'Mucousy'
    };
    return labels[consistency] || 'Unknown';
  };

  return {
    healthIndicators,
    recentIndicators,
    abnormalIndicators,
    healthAlerts,
    isLoadingIndicators,
    isLoadingRecent,
    isLoadingAbnormal,
    isLoadingAlerts,
    indicatorsError,
    recentError,
    abnormalError,
    alertsError,
    addIndicator: addIndicator.mutate,
    updateIndicator: updateIndicator.mutate,
    deleteIndicator: deleteIndicator.mutate,
    resolveAlert: resolveAlert.mutate,
    isAdding: addIndicator.isPending,
    isUpdating: updateIndicator.isPending,
    isDeleting: deleteIndicator.isPending,
    isResolving: resolveAlert.isPending,
    refetchIndicators,
    refetchAlerts,
    getMostRecentIndicator,
    hasActiveAlerts,
    getAppetiteLevelLabel,
    getEnergyLevelLabel,
    getStoolConsistencyLabel
  };
};
