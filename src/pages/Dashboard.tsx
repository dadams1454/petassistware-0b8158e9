
import React from 'react';
import { SectionHeader } from '@/components/ui/standardized';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { RefreshProvider } from '@/contexts/RefreshContext';
import { DailyCareProvider } from '@/contexts/dailyCare';
import PageContainer from '@/components/common/PageContainer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Heart, Calendar } from 'lucide-react';
import { useHeatCycleStatus } from '@/hooks/breeding/useHeatCycleStatus';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DashboardData, UpcomingEvent, RecentActivity } from '@/services/dashboard/types';

const Dashboard: React.FC = () => {
  const { alerts, hasAlerts } = useHeatCycleStatus();
  const navigate = useNavigate();
  
  const handleGoToBreeding = (dogId?: string) => {
    if (dogId) {
      navigate(`/breeding/prepare?dogId=${dogId}`);
    } else {
      navigate('/litters');
    }
  };

  // Mock data for dashboard stats, events, and activities
  const dashboardStats: DashboardData = {
    totalDogs: 0,
    activeDogs: 0,
    totalLitters: 0,
    activeLitters: 0,
    totalPuppies: 0,
    availablePuppies: 0,
    totalCustomers: 0
  };

  const upcomingEvents: UpcomingEvent[] = [];
  const recentActivities: RecentActivity[] = [];
  
  return (
    <PageContainer>
      <RefreshProvider>
        <DashboardProvider>
          <DailyCareProvider>
            <div className="space-y-6 p-6">
              <div className="flex items-center justify-between pb-4">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              </div>
              
              {hasAlerts && (
                <Alert className="bg-purple-950/40 border-purple-800 text-purple-300">
                  <Heart className="h-4 w-4 text-purple-500" />
                  <AlertTitle className="text-white font-medium">Heat Cycle Alerts</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2 text-purple-200">
                    <div>
                      {alerts.map((alert) => (
                        <div key={alert.dogId} className="mb-1 flex justify-between items-center">
                          <span>
                            <strong>{alert.dogName}</strong> 
                            {alert.alertType === 'upcoming' ? (
                              <span> heat cycle approaching in {alert.daysUntil} days</span>
                            ) : (
                              <span> is currently in heat (day {alert.daysPast})</span>
                            )}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="ml-4 border-purple-700 bg-purple-900/40 text-purple-200 hover:bg-purple-900 hover:text-purple-100"
                            onClick={() => handleGoToBreeding(alert.dogId)}
                          >
                            Manage Breeding
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-fit mt-1 border-purple-700 bg-purple-900/40 text-purple-200 hover:bg-purple-900 hover:text-purple-100"
                      onClick={() => handleGoToBreeding()}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Breeding
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <h2 className="text-xl font-bold text-white mt-4">Overview</h2>
              
              <DashboardContent 
                isLoading={false}
                stats={dashboardStats}
                events={upcomingEvents}
                activities={recentActivities}
              />
            </div>
          </DailyCareProvider>
        </DashboardProvider>
      </RefreshProvider>
    </PageContainer>
  );
};

export default Dashboard;
