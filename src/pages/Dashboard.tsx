
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
  
  const handleGoToBreeding = (dogId?: string) => {
    if (dogId) {
      navigate(`/breeding/prepare?dogId=${dogId}`);
    } else {
      navigate('/litters');
    }
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
                            className="ml-4"
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
                      className="w-fit mt-1"
                      onClick={() => handleGoToBreeding()}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Breeding
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
