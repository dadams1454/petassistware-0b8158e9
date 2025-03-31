
import React from 'react';
import { SectionHeader } from '@/components/ui/standardized';
import FinancialDashboardWidget from '@/components/finances/FinancialDashboardWidget';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { RefreshProvider } from '@/contexts/RefreshContext';
import { DailyCareProvider } from '@/contexts/dailyCare';
import PageContainer from '@/components/common/PageContainer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Heart } from 'lucide-react';

const Dashboard: React.FC = () => {
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
              
              <Alert className="bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
                <Heart className="h-4 w-4 text-purple-500" />
                <AlertTitle>Heat Cycle Monitoring Available</AlertTitle>
                <AlertDescription>
                  Track and manage heat cycles for your female dogs. Visit the Puppies tab for breeding management.
                </AlertDescription>
              </Alert>
              
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
