
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing: boolean;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ onRefreshDogs, isRefreshing }) => {
  const { dogStatuses } = useDailyCare();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const isRefreshingRef = useRef(false);
  
  // Auto-refresh every 30 minutes instead of 15 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Skip if refresh is already in progress
      if (isRefreshingRef.current || isRefreshing) {
        console.log('🔄 Auto refresh skipped - refresh already in progress');
        return;
      }
      
      console.log('🔄 Auto refresh triggered in DailyCareTab');
      isRefreshingRef.current = true;
      onRefreshDogs();
      setLastRefresh(new Date());
      
      // Reset the flag after a short delay
      setTimeout(() => {
        isRefreshingRef.current = false;
      }, 5000);
    }, 30 * 60 * 1000); // 30 minutes
    
    return () => clearInterval(intervalId);
  }, [onRefreshDogs, isRefreshing]);
  
  // Handle manual refresh
  const handleRefresh = () => {
    // Skip if refresh is already in progress
    if (isRefreshingRef.current || isRefreshing) {
      console.log('🔄 Manual refresh skipped - refresh already in progress');
      return;
    }
    
    console.log('🔄 Manual refresh triggered in DailyCareTab');
    isRefreshingRef.current = true;
    onRefreshDogs();
    setLastRefresh(new Date());
    
    // Reset the flag after a short delay
    setTimeout(() => {
      isRefreshingRef.current = false;
    }, 5000);
  };
  
  if (!dogStatuses || dogStatuses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <p className="text-muted-foreground mb-4">No dogs found. Please refresh or add dogs to the system.</p>
          <Button onClick={handleRefresh} disabled={isRefreshing || isRefreshingRef.current}>
            {isRefreshing || isRefreshingRef.current ? 'Refreshing...' : 'Refresh Dogs'}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <span className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <Clock className="h-3 w-3" />
          Auto-refreshes every 30 minutes
        </span>
      </div>
      
      {/* Reminder Card */}
      <PottyBreakReminderCard 
        dogs={dogStatuses}
        onLogPottyBreak={() => {
          // Just scroll to the timetable on click
          const timeTableSection = document.getElementById('dog-time-table');
          if (timeTableSection) {
            timeTableSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
      
      {/* Time Table (now the main and only component) */}
      <div id="dog-time-table">
        <DogTimeTable 
          dogsStatus={dogStatuses} 
          onRefresh={handleRefresh} 
        />
      </div>
    </div>
  );
};

export default DailyCareTab;
