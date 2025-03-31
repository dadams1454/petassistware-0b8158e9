
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  ClipboardList, 
  Clock, 
  RefreshCw, 
  Banknote, 
  Wrench 
} from 'lucide-react';
import TasksView from '@/components/facility/TasksView';
import StaffManagement from '@/components/facility/StaffManagement';
import MaintenanceSchedule from '@/components/facility/MaintenanceSchedule';
import StaffSchedule from '@/components/facility/StaffSchedule';
import ExpenseTracking from '@/components/facility/ExpenseTracking';

const Facility: React.FC = () => {
  const [activeTab, setActiveTab] = useState('staff');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Facility Management
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Manage staff, tasks, maintenance, and facility expenses
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
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

        <TabsContent value="expenses" className="mt-0">
          <ExpenseTracking />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Facility;
