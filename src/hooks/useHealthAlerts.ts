
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays } from 'date-fns';

interface HealthAlertParams {
  dogId: string;
  lookbackDays?: number;
}

export const useHealthAlerts = ({ dogId, lookbackDays = 30 }: HealthAlertParams) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch health indicators and daily care logs
  const { data, isLoading, error } = useQuery({
    queryKey: ['health-alerts', dogId, lookbackDays],
    queryFn: async () => {
      try {
        // Calculate date range
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - lookbackDays);
        
        const startDateStr = startDate.toISOString().split('T')[0];
        
        // Fetch health indicators
        const { data: indicators, error: indicatorsError } = await supabase
          .from('health_indicators')
          .select('*')
          .eq('dog_id', dogId)
          .gte('date', startDateStr)
          .order('date', { ascending: false });
        
        if (indicatorsError) throw indicatorsError;
        
        // Fetch daily care logs
        const { data: careLogs, error: careLogsError } = await supabase
          .from('daily_care_logs')
          .select('*')
          .eq('dog_id', dogId)
          .gte('timestamp', startDate.toISOString())
          .order('timestamp', { ascending: false });
        
        if (careLogsError) throw careLogsError;
        
        // Fetch existing alerts
        const { data: alerts, error: alertsError } = await supabase
          .from('health_alerts')
          .select('*')
          .eq('dog_id', dogId)
          .eq('resolved', false)
          .order('created_at', { ascending: false });
        
        if (alertsError) throw alertsError;
        
        return {
          indicators: indicators || [],
          careLogs: careLogs || [],
          alerts: alerts || []
        };
      } catch (err) {
        console.error('Error fetching health data:', err);
        throw err;
      }
    }
  });
  
  // Process and detect trends
  const abnormalIndicators = data?.indicators.filter(i => i.abnormal) || [];
  
  const weightRecords = data?.careLogs.filter(log => 
    log.category === 'weight' && log.task_name === 'weight_check'
  ) || [];
  
  // Check for weight loss trend
  const hasWeightLossTrend = (() => {
    if (weightRecords.length < 2) return false;
    
    // Sort by newest first
    const sortedRecords = [...weightRecords].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Check if latest weight is lower than previous by >5%
    if (sortedRecords.length >= 2) {
      const latest = Number(sortedRecords[0].notes || '0');
      const previous = Number(sortedRecords[1].notes || '0');
      
      if (latest && previous && latest < previous * 0.95) {
        return true;
      }
    }
    
    return false;
  })();
  
  // Check for abnormal stool trend
  const hasAbnormalStoolTrend = (() => {
    const stoolLogs = data?.careLogs.filter(log => 
      log.category === 'elimination' && log.task_name === 'stool'
    ) || [];
    
    if (stoolLogs.length < 2) return false;
    
    // Count abnormal stools in the last 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const recentStools = stoolLogs.filter(log => 
      new Date(log.timestamp) >= threeDaysAgo
    );
    
    const abnormalStools = recentStools.filter(log => {
      const notes = (log.notes || '').toLowerCase();
      return notes.includes('loose') || 
             notes.includes('diarrhea') || 
             notes.includes('blood') ||
             notes.includes('abnormal');
    });
    
    // Alert if >50% of stools in last 3 days are abnormal
    return recentStools.length >= 2 && 
           abnormalStools.length / recentStools.length >= 0.5;
  })();
  
  // Check for missed meals trend
  const hasMissedMealsTrend = (() => {
    const feedingLogs = data?.careLogs.filter(log => 
      log.category === 'feeding'
    ) || [];
    
    if (feedingLogs.length < 2) return false;
    
    // Count low/no appetite instances in the last 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const recentFeedings = feedingLogs.filter(log => 
      new Date(log.timestamp) >= twoDaysAgo
    );
    
    const missedMeals = recentFeedings.filter(log => {
      const notes = (log.notes || '').toLowerCase();
      return notes.includes('refused') || 
             notes.includes('did not eat') ||
             notes.includes('partial') ||
             notes.includes('low appetite');
    });
    
    // Alert if >=2 missed meals in last 2 days
    return missedMeals.length >= 2;
  })();
  
  // Generate consolidated alerts
  const generatedAlerts = [
    ...(abnormalIndicators.length > 0 ? [{
      type: 'abnormal_indicators',
      title: 'Abnormal Health Indicators',
      description: `${abnormalIndicators.length} abnormal health indicators recorded recently`,
      level: 'warning'
    }] : []),
    
    ...(hasWeightLossTrend ? [{
      type: 'weight_loss',
      title: 'Weight Loss Detected',
      description: 'Significant weight loss detected in recent measurements',
      level: 'warning'
    }] : []),
    
    ...(hasAbnormalStoolTrend ? [{
      type: 'abnormal_stool',
      title: 'Abnormal Stool Pattern',
      description: 'Multiple instances of abnormal stool recorded recently',
      level: 'warning'
    }] : []),
    
    ...(hasMissedMealsTrend ? [{
      type: 'missed_meals',
      title: 'Decreased Appetite',
      description: 'Dog has refused multiple meals recently',
      level: 'warning'
    }] : [])
  ];
  
  // Combine with existing alerts from database
  const existingAlerts = data?.alerts || [];
  
  // Resolution functionality
  const resolveAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { data, error } = await supabase
        .from('health_alerts')
        .update({ 
          resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: 'Alert resolved',
        description: 'The health alert has been marked as resolved'
      });
      queryClient.invalidateQueries({ queryKey: ['health-alerts', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to resolve alert: ${(error as Error).message}`,
        variant: 'destructive'
      });
    }
  });
  
  // Add new alert
  const addAlert = useMutation({
    mutationFn: async (alertData: {
      indicatorId?: string;
      status: string;
      type: string;
      description: string;
    }) => {
      const { data, error } = await supabase
        .from('health_alerts')
        .insert({
          dog_id: dogId,
          indicator_id: alertData.indicatorId || null,
          status: alertData.status,
          alert_type: alertData.type,
          description: alertData.description,
          created_at: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: 'Alert created',
        description: 'A new health alert has been created'
      });
      queryClient.invalidateQueries({ queryKey: ['health-alerts', dogId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create alert: ${(error as Error).message}`,
        variant: 'destructive'
      });
    }
  });
  
  return {
    isLoading,
    error,
    healthData: data,
    generatedAlerts,
    existingAlerts,
    resolveAlert: resolveAlert.mutateAsync,
    addAlert: addAlert.mutateAsync,
    hasWeightLossTrend,
    hasAbnormalStoolTrend,
    hasMissedMealsTrend
  };
};
