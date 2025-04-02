
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FacilityDailyChecklist from '@/components/facility/FacilityDailyChecklist';
import DogLetOutTab from '@/components/facility/DogLetOutTab';
import InventoryManagement from '@/components/facility/InventoryManagement';
import MaintenanceSchedule from '@/components/facility/MaintenanceSchedule';

const Facility: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Facility Management"
          subtitle="Manage your facility operations and maintenance"
          className="mb-6"
        />
        
        <Tabs defaultValue="daily-checklist" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily-checklist">Daily Checklist</TabsTrigger>
            <TabsTrigger value="dog-let-out">Dog Let Out</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily-checklist" className="space-y-4">
            <FacilityDailyChecklist />
          </TabsContent>
          
          <TabsContent value="dog-let-out" className="space-y-4">
            <DogLetOutTab />
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <InventoryManagement />
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-4">
            <MaintenanceSchedule />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Facility;
