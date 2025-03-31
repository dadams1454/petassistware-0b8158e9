
import React from 'react';
import { SectionHeader } from '@/components/ui/standardized';
import FinancialDashboardWidget from '@/components/finances/FinancialDashboardWidget';
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

const Dashboard: React.FC = () => {
  const { alerts, hasAlerts } = useHeatCycleStatus();
  const navigate = useNavigate();
  
  const handleGoToLitters = () => {
    navigate('/litters');
  };
  
  return (
    <PageContainer>
      <RefreshProvider>
        <DashboardProvider>
          <DailyCareProvider>
            <div className="space-y-6">
              <SectionHeader 
                title="Dashboard" 
                description="Welcome to your kennel management dashboard"
              />
              
              {hasAlerts && (
                <Alert className="bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
                  <Heart className="h-4 w-4 text-purple-500" />
                  <AlertTitle>Heat Cycle Alerts</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    <div>
                      {alerts.map((alert) => (
                        <div key={alert.dogId} className="mb-1">
                          {alert.alertType === 'upcoming' ? (
                            <span><strong>{alert.dogName}</strong> heat cycle approaching in {alert.daysUntil} days</span>
                          ) : (
                            <span><strong>{alert.dogName}</strong> is currently in heat (day {alert.daysPast})</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-fit mt-1"
                      onClick={handleGoToLitters}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage Breeding
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FinancialDashboardWidget />
                {/* Add more dashboard widgets here as they are developed */}
              </div>
              
              {/* Daily Care and other dashboard content */}
              <DashboardContent 
                isLoading={false}
                stats={{
                  totalDogs: 0,
                  activeDogs: 0,
                  totalLitters: 0,
                  activeLitters: 0,
                  totalPuppies: 0,
                  availablePuppies: 0,
                  totalCustomers: 0
                }}
                events={[]}
                activities={[]}
              />
            </div>
          </DailyCareProvider>
        </DashboardProvider>
      </RefreshProvider>
    </PageContainer>
  );
};

export default Dashboard;
