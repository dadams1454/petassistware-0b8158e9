import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/standardized';
import { 
  Building2, 
  Users, 
  ClipboardList, 
  Clock, 
  Banknote, 
  Wrench,
  Package,
  Home
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import TasksView from '@/components/facility/TasksView';
import StaffManagement from '@/components/facility/StaffManagement';
import MaintenanceSchedule from '@/components/facility/MaintenanceSchedule';
import StaffSchedule from '@/components/facility/StaffSchedule';
import ExpenseTracking from '@/components/facility/ExpenseTracking';
import InventoryManagement from '@/components/facility/InventoryManagement';
import KennelManagement from './KennelManagement';
import { useIsMobile } from '@/hooks/use-mobile';
import PageContainer from '@/components/common/PageContainer';

const Facility: React.FC = () => {
  const [activeTab, setActiveTab] = useState('staff');
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    // Check if we have a state with an activeTab
    if (location.state && location.state.activeTab === 'kennels') {
      setActiveTab('kennels');
    }
  }, [location.state]);

  return (
    <PageContainer>
      <div className="space-y-6 w-full">
        <PageHeader 
          title="Facility Management"
          description="Manage staff, tasks, maintenance, facility expenses, and inventory"
          action={<Building2 className="h-6 w-6 text-primary" />}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-7'} mb-6 w-full`}>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Staff Management</span>
            </TabsTrigger>
            
            <TabsTrigger value="staff-schedule" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Staff Schedule</span>
            </TabsTrigger>
            
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>Tasks</span>
            </TabsTrigger>
            
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span>Maintenance</span>
            </TabsTrigger>
            
            <TabsTrigger value="kennels" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Kennels</span>
            </TabsTrigger>
            
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Inventory</span>
            </TabsTrigger>
            
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              <span>Expenses</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="mt-0">
            <StaffManagement />
          </TabsContent>

          <TabsContent value="staff-schedule" className="mt-0">
            <StaffSchedule />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <TasksView 
              filteredTasks={[]}
              isLoading={false}
              searchQuery=""
              setSearchQuery={() => {}}
              selectedFrequency="all"
              setSelectedFrequency={() => {}}
              handleAddTask={() => {}}
              handleEditTask={() => {}}
              refetchTasks={() => {}}
            />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-0">
            <MaintenanceSchedule />
          </TabsContent>

          <TabsContent value="kennels" className="mt-0">
            <KennelManagement />
          </TabsContent>

          <TabsContent value="inventory" className="mt-0">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="expenses" className="mt-0">
            <ExpenseTracking />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Facility;
