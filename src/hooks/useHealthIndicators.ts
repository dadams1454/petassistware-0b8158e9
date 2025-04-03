
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppetiteLevelEnum, EnergyLevelEnum, HealthIndicator, StoolConsistencyEnum } from '@/types/health';
import { useToast } from '@/hooks/use-toast';
import { formatDateToYYYYMMDD } from '@/utils/dateUtils';

export interface HealthIndicatorFormValues {
  dog_id: string;
  date: Date;
  appetite?: AppetiteLevelEnum;
  energy?: EnergyLevelEnum;
  stool_consistency?: StoolConsistencyEnum;
  abnormal: boolean;
  notes?: string;
}

export const useHealthIndicators = (dogId: string) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResolvingAlert, setIsResolvingAlert] = useState(false);
  const { toast } = useToast();
  
  // Get all health indicators
  const { 
    data: indicators = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['health-indicators', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_indicators')
        .select('*')
        .eq('dog_id', dogId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as HealthIndicator[];
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
      const { data, error } = await supabase
        .from('health_alerts')
        .select('*')
        .eq('dog_id', dogId);
      
      if (error) throw error;
      return data;
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
      case EnergyLevelEnum.Hyperactive: return 'Hyperactive';
      case EnergyLevelEnum.High: return 'High';
      case EnergyLevelEnum.Normal: return 'Normal';
      case EnergyLevelEnum.Low: return 'Low';
      case EnergyLevelEnum.Lethargic: return 'Lethargic';
      default: return level;
    }
  };
  
  const getStoolConsistencyLabel = (consistency: string | null) => {
    if (!consistency) return 'Not recorded';
    
    switch (consistency) {
      case StoolConsistencyEnum.Normal: return 'Normal';
      case StoolConsistencyEnum.Soft: return 'Soft';
      case StoolConsistencyEnum.Loose: return 'Loose';
      case StoolConsistencyEnum.Watery: return 'Watery';
      case StoolConsistencyEnum.Hard: return 'Hard';
      case StoolConsistencyEnum.Mucousy: return 'Mucousy';
      case StoolConsistencyEnum.Bloody: return 'Bloody';
      default: return consistency;
    }
  };
  
  const addIndicator = async (values: HealthIndicatorFormValues) => {
    setIsAdding(true);
    try {
      // Format date to YYYY-MM-DD string
      const formattedDate = formatDateToYYYYMMDD(values.date);
      
      const { data, error } = await supabase
        .from('health_indicators')
        .insert({
          dog_id: values.dog_id,
          date: formattedDate,
          appetite: values.appetite,
          energy: values.energy,
          stool_consistency: values.stool_consistency,
          abnormal: values.abnormal,
          notes: values.notes
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Health indicators recorded',
        description: 'The health indicators have been successfully recorded.',
      });
      
      await refetch();
      await refetchAlerts();
      
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error adding health indicator:', error);
      
      toast({
        title: 'Error',
        description: 'Failed to record health indicators.',
        variant: 'destructive',
      });
      
      return { success: false, data: null };
    } finally {
      setIsAdding(false);
    }
  };

  const deleteIndicator = async (indicatorId: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('health_indicators')
        .delete()
        .eq('id', indicatorId);
      
      if (error) throw error;
      
      toast({
        title: 'Health indicator deleted',
        description: 'The health indicator has been successfully deleted.',
      });
      
      await refetch();
      await refetchAlerts();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting health indicator:', error);
      
      toast({
        title: 'Error',
        description: 'Failed to delete health indicator.',
        variant: 'destructive',
      });
      
      return { success: false };
    } finally {
      setIsDeleting(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    setIsResolvingAlert(true);
    try {
      const { error } = await supabase
        .from('health_alerts')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);
      
      if (error) throw error;
      
      toast({
        title: 'Alert resolved',
        description: 'The health alert has been marked as resolved.',
      });
      
      await refetchAlerts();
      
      return { success: true };
    } catch (error) {
      console.error('Error resolving health alert:', error);
      
      toast({
        title: 'Error',
        description: 'Failed to resolve health alert.',
        variant: 'destructive',
      });
      
      return { success: false };
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
