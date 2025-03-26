
import React, { useState, useEffect } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/hooks/use-toast';
import { 
  LoadingState, 
  ErrorState, 
  EmptyState 
} from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import {
  Clock, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getCareTypeIcon, getCareTypeColor, getRelativeTimeString } from './utils/careUtils';
import { useCareActivities } from '@/hooks/useCareActivities';

interface EnhancedDailyCareTabProps {
  dogId: string;
  dogName?: string;
}

const EnhancedDailyCareTab: React.FC<EnhancedDailyCareTabProps> = ({ dogId, dogName = 'Dog' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchDogCareLogs } = useDailyCare();
  const { toast } = useToast();
  const [careLogs, setCareLogs] = useState<any[]>([]);
  
  // Fetch care logs safely
  const loadCareLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!dogId) {
        setError('Dog ID is required');
        return;
      }
      
      const logs = await fetchDogCareLogs(dogId);
      console.log('Loaded care logs:', logs);
      setCareLogs(logs || []);
    } catch (err) {
      console.error('Error loading care logs:', err);
      setError('Failed to load care logs. Please try again.');
      
      toast({
        title: 'Error',
        description: 'Could not load care information',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load care logs on mount and when dogId changes
  useEffect(() => {
    loadCareLogs();
  }, [dogId]);
  
  const handleRetry = () => {
    loadCareLogs();
  };
  
  if (loading) {
    return <LoadingState message={`Loading care information for ${dogName}...`} />;
  }
  
  if (error) {
    return (
      <ErrorState 
        title="Error Loading Care Information" 
        message={error} 
        onRetry={handleRetry} 
      />
    );
  }
  
  if (careLogs.length === 0) {
    return (
      <EmptyState
        title="No Care Logs Found"
        description={`No care logs have been recorded for ${dogName} yet.`}
        icon={<Clock className="h-12 w-12 text-muted-foreground" />}
        action={{
          label: "Refresh",
          onClick: handleRetry
        }}
      />
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Care History for {dogName}</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRetry}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow border">
        <div className="p-4 border-b">
          <h3 className="font-medium">Recent Care Activities</h3>
        </div>
        <div className="divide-y">
          {careLogs.map((log) => {
            const careIcon = getCareTypeIcon(log.category);
            const careColor = getCareTypeColor(log.category);
            const timeAgo = getRelativeTimeString(new Date(log.timestamp));
            
            return (
              <div key={log.id} className="p-4 flex items-start">
                <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center bg-${careColor}-100 text-${careColor}-500`}>
                  <span className="lucide">{careIcon}</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{log.task_name || log.category}</h4>
                    <span className="text-xs text-gray-500">{timeAgo}</span>
                  </div>
                  {log.notes && <p className="text-sm text-gray-600 mt-1">{log.notes}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {careLogs.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {careLogs.length} care {careLogs.length === 1 ? 'record' : 'records'} for {dogName}
        </div>
      )}
    </div>
  );
};

export default EnhancedDailyCareTab;
