
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeader } from '@/components/ui/standardized';
import { Building2, Store, Brush, Wrench, Calendar } from 'lucide-react';
import PageContainer from '@/components/common/PageContainer';
import KennelUnitsTab from '@/components/kennel/KennelUnitsTab';
import KennelAssignmentsTab from '@/components/kennel/KennelAssignmentsTab';
import KennelCleaningTab from '@/components/kennel/KennelCleaningTab';
import KennelMaintenanceTab from '@/components/kennel/KennelMaintenanceTab';
import KennelCleaningScheduleTab from '@/components/kennel/KennelCleaningScheduleTab';
import { useKennelManagement } from '@/hooks/useKennelManagement';
import { useIsMobile } from '@/hooks/use-mobile';

const KennelManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('units');
  const isMobile = useIsMobile();
  const kennelManagement = useKennelManagement();

  return (
    <PageContainer>
      <div className="space-y-6">
        <SectionHeader 
          title="Kennel Housing Management" 
          description="Manage kennel units, assignments, cleaning, and maintenance"
          action={{
            label: "Refresh Data",
            onClick: kennelManagement.fetchAllData,
            variant: "outline"
          }}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-5'} mb-6 w-full`}>
            <TabsTrigger value="units" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span>Kennel Units</span>
            </TabsTrigger>
            
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Assignments</span>
            </TabsTrigger>
            
            <TabsTrigger value="cleaning" className="flex items-center gap-2">
              <Brush className="h-4 w-4" />
              <span>Cleaning Records</span>
            </TabsTrigger>
            
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span>Maintenance</span>
            </TabsTrigger>
            
            <TabsTrigger value="schedules" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Cleaning Schedules</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="units" className="mt-0">
            <KennelUnitsTab 
              kennelUnits={kennelManagement.kennelUnits}
              loading={kennelManagement.loading.units}
              addKennelUnit={kennelManagement.addKennelUnit}
              updateKennelUnit={kennelManagement.updateKennelUnit}
              deleteKennelUnit={kennelManagement.deleteKennelUnit}
            />
          </TabsContent>

          <TabsContent value="assignments" className="mt-0">
            <KennelAssignmentsTab 
              kennelAssignments={kennelManagement.kennelAssignments}
              kennelUnits={kennelManagement.kennelUnits}
              loading={kennelManagement.loading.assignments}
              addKennelAssignment={kennelManagement.addKennelAssignment}
              endKennelAssignment={kennelManagement.endKennelAssignment}
            />
          </TabsContent>

          <TabsContent value="cleaning" className="mt-0">
            <KennelCleaningTab 
              cleaningRecords={kennelManagement.cleaningRecords}
              kennelUnits={kennelManagement.kennelUnits}
              loading={kennelManagement.loading.cleaning}
              addCleaningRecord={kennelManagement.addCleaningRecord}
            />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-0">
            <KennelMaintenanceTab 
              maintenanceRecords={kennelManagement.maintenanceRecords}
              kennelUnits={kennelManagement.kennelUnits}
              loading={kennelManagement.loading.maintenance}
              addMaintenanceRecord={kennelManagement.addMaintenanceRecord}
              updateMaintenanceRecord={kennelManagement.updateMaintenanceRecord}
            />
          </TabsContent>

          <TabsContent value="schedules" className="mt-0">
            <KennelCleaningScheduleTab 
              cleaningSchedules={kennelManagement.cleaningSchedules}
              kennelUnits={kennelManagement.kennelUnits}
              loading={kennelManagement.loading.schedules}
              addCleaningSchedule={kennelManagement.addCleaningSchedule}
              updateCleaningSchedule={kennelManagement.updateCleaningSchedule}
              deleteCleaningSchedule={kennelManagement.deleteCleaningSchedule}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default KennelManagement;
