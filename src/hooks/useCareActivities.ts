
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recordCareActivity, getRecentCareActivities, getLastCareActivity, CareActivity } from '@/services/careService';

export function useCareActivities(dogId: string, activityType?: CareActivity['activity_type']) {
  const queryClient = useQueryClient();
  
  const careActivitiesQuery = useQuery({
    queryKey: ['careActivities', dogId, activityType],
    queryFn: () => getRecentCareActivities(dogId, activityType),
    enabled: !!dogId,
  });
  
  const lastActivityQuery = useQuery({
    queryKey: ['lastCareActivity', dogId, activityType],
    queryFn: () => activityType ? getLastCareActivity(dogId, activityType) : null,
    enabled: !!dogId && !!activityType,
  });
  
  const addActivityMutation = useMutation({
    mutationFn: recordCareActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careActivities', dogId] });
      queryClient.invalidateQueries({ queryKey: ['lastCareActivity', dogId] });
      // Also invalidate the dailyCare hook to ensure dashboard is updated
      queryClient.invalidateQueries({ queryKey: ['dogCare'] });
    },
  });
  
  return {
    activities: careActivitiesQuery.data || [],
    lastActivity: lastActivityQuery.data,
    isLoading: careActivitiesQuery.isLoading || lastActivityQuery.isLoading,
    isError: careActivitiesQuery.isError || lastActivityQuery.isError,
    error: careActivitiesQuery.error || lastActivityQuery.error,
    recordActivity: addActivityMutation.mutate,
    isRecording: addActivityMutation.isPending,
  };
}
