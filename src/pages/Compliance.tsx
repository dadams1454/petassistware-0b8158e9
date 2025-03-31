
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/standardized';
import { Shield, FileCheck, Calendar, AlertTriangle } from 'lucide-react';
import LicenseManagement from '@/components/compliance/LicenseManagement';
import InspectionTracker from '@/components/compliance/InspectionTracker';
import RequirementsDashboard from '@/components/compliance/RequirementsDashboard';
import ComplianceCalendar from '@/components/compliance/ComplianceCalendar';
import { useIsMobile } from '@/hooks/use-mobile';
import PageContainer from '@/components/common/PageContainer';

const Compliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader 
          title="Compliance Management"
          description="Track licenses, inspections, and regulatory requirements"
          action={<Shield className="h-6 w-6 text-primary" />}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-4'} mb-6`}>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Requirements</span>
            </TabsTrigger>
            
            <TabsTrigger value="licenses" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span>Licenses</span>
            </TabsTrigger>
            
            <TabsTrigger value="inspections" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Inspections</span>
            </TabsTrigger>
            
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <RequirementsDashboard />
          </TabsContent>

          <TabsContent value="licenses" className="mt-0">
            <LicenseManagement />
          </TabsContent>

          <TabsContent value="inspections" className="mt-0">
            <InspectionTracker />
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <ComplianceCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Compliance;
