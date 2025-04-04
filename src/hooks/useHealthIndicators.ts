
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { HealthIndicator, HealthAlert, AppetiteLevelEnum, EnergyLevelEnum, StoolConsistencyEnum } from '@/types/health';

export const useHealthIndicators = (dogId: string) => {
  const queryClient = useQueryClient();
  const [indicators, setIndicators] = useState<HealthIndicator[]>([]);
  const [recentIndicators, setRecentIndicators] = useState<HealthIndicator[]>([]);
  const [abnormalIndicators, setAbnormalIndicators] = useState<HealthIndicator[]>([]);
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([]);
  const [hasActiveAlerts, setHasActiveAlerts] = useState(false);
  
  // Fetch health indicators
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['healthIndicators', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_indicators')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as HealthIndicator[];
    }
  });
  
  // Fetch health alerts
  const {
    data: alertsData,
    isLoading: isLoadingAlerts,
    refetch: refetchAlerts
  } = useQuery({
    queryKey: ['healthAlerts', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_alerts')
        .select('*')
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as HealthAlert[];
    }
  });

  // Update state based on query results
  useEffect(() => {
    if (data) {
      setIndicators(data);
      setRecentIndicators(data.slice(0, 5));
      setAbnormalIndicators(data.filter(indicator => indicator.abnormal));
    }
  }, [data]);
  
  useEffect(() => {
    if (alertsData) {
      setHealthAlerts(alertsData);
      setHasActiveAlerts(alertsData.some(alert => !alert.resolved));
    }
  }, [alertsData]);
  
  // Add health indicator
  const { mutate: addHealthIndicator, isPending: isSubmitting } = useMutation({
    mutationFn: async (indicator: Omit<HealthIndicator, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from('health_indicators')
        .insert(indicator)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthIndicators', dogId] });
      queryClient.invalidateQueries({ queryKey: ['healthAlerts', dogId] });
    },
    onError: (error) => {
      console.error('Error adding health indicator:', error);
      toast({
        title: 'Error',
        description: 'Failed to add health indicator. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Update health indicator
  const { mutate: updateHealthIndicator } = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<HealthIndicator>) => {
      const { data, error } = await supabase
        .from('health_indicators')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthIndicators', dogId] });
    }
  });
  
  // Delete health indicator
  const { mutate: deleteIndicator } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('health_indicators')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthIndicators', dogId] });
      toast({
        title: 'Success',
        description: 'Health indicator deleted successfully.',
      });
    }
  });
  
  // Resolve health alert
  const { mutate: resolveAlert } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('health_alerts')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthAlerts', dogId] });
      toast({
        title: 'Success',
        description: 'Health alert resolved successfully.',
      });
    }
  });

  // Helper functions to get display labels for enum values
  const getAppetiteLevelLabel = (level?: string): string => {
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
  
  const getEnergyLevelLabel = (level?: string): string => {
    if (!level) return 'Not recorded';
    
    switch (level) {
      case EnergyLevelEnum.Hyperactive: return 'Hyperactive';
      case EnergyLevelEnum.High: return 'High';
      case EnergyLevelEnum.Normal: return 'Normal';
      case EnergyLevelEnum.Low: return 'Low';
      case EnergyLevelEnum.Lethargic: return 'Lethargic';
      default: return level;
    }
  };
  
  const getStoolConsistencyLabel = (consistency?: string): string => {
    if (!consistency) return 'Not recorded';
    
    switch (consistency) {
      case StoolConsistencyEnum.NORMAL: return 'Normal';
      case StoolConsistencyEnum.SOFT: return 'Soft';
      case StoolConsistencyEnum.LOOSE: return 'Loose';
      case StoolConsistencyEnum.WATERY: return 'Watery';
      case StoolConsistencyEnum.HARD: return 'Hard';
      case StoolConsistencyEnum.MUCOUSY: return 'Mucousy';
      case StoolConsistencyEnum.BLOODY: return 'Bloody';
      default: return consistency;
    }
  };

  return {
    indicators,
    recentIndicators,
    abnormalIndicators,
    healthAlerts,
    isLoading,
    isLoadingRecent: isLoading,
    isLoadingAbnormal: isLoading,
    isLoadingAlerts,
    isSubmitting,
    addHealthIndicator,
    updateHealthIndicator,
    deleteIndicator,
    resolveAlert,
    getAppetiteLevelLabel,
    getEnergyLevelLabel,
    getStoolConsistencyLabel,
    hasActiveAlerts,
    refetch
  };
};
