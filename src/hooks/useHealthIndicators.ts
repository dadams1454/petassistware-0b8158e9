
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  addHealthIndicator,
  deleteHealthIndicator,
  getHealthIndicatorsForDog,
  HealthIndicator, 
  HealthIndicatorFormValues,
  resolveHealthAlert,
  getHealthAlertsForDog
} from '@/services/healthIndicatorService';
import { useAuth } from '@/contexts/AuthProvider';
import { AppetiteLevelEnum, EnergyLevelEnum, StoolConsistencyEnum } from '@/types/health';

export const useHealthIndicators = (dogId: string) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResolvingAlert, setIsResolvingAlert] = useState(false);
  const { user } = useAuth();
  
  // Get all health indicators
  const { 
    data: indicators = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['health-indicators', dogId],
    queryFn: async () => {
      return getHealthIndicatorsForDog(dogId);
    },
    enabled: !!dogId
  });
  
  // Get health alerts
  const {
    data: healthAlerts = [],
    isLoading: isLoadingAlerts,
    refetch: refetchAlerts
  } = useQuery({
    queryKey: ['health-alerts', dogId],
    queryFn: async () => {
      return getHealthAlertsForDog(dogId);
    },
    enabled: !!dogId
  });

  // Derive recent and abnormal indicators
  const recentIndicators = indicators
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const abnormalIndicators = indicators
    .filter(indicator => indicator.abnormal)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const hasActiveAlerts = healthAlerts.some(alert => !alert.resolved);
  
  // Helper functions for label display
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
  
  const addIndicator = async (values: HealthIndicatorFormValues) => {
    setIsAdding(true);
    try {
      const result = await addHealthIndicator(values, user?.id);
      if (result.success) {
        await refetch();
        await refetchAlerts();
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Error adding health indicator:', error);
      return null;
    } finally {
      setIsAdding(false);
    }
  };

  const deleteIndicator = async (indicatorId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteHealthIndicator(indicatorId);
      if (result.success) {
        await refetch();
        await refetchAlerts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting health indicator:', error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    setIsResolvingAlert(true);
    try {
      const result = await resolveHealthAlert(alertId);
      if (result.success) {
        await refetchAlerts();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error resolving health alert:', error);
      return false;
    } finally {
      setIsResolvingAlert(false);
    }
  };
  
  return {
    indicators,
    recentIndicators,
    abnormalIndicators,
    healthAlerts,
    hasActiveAlerts,
    isLoading,
    isLoadingRecent: isLoading,
    isLoadingAbnormal: isLoading,
    isLoadingAlerts,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    isResolvingAlert,
    addIndicator,
    deleteIndicator,
    resolveAlert,
    refetch,
    getAppetiteLevelLabel,
    getEnergyLevelLabel,
    getStoolConsistencyLabel
  };
};
