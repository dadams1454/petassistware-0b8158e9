
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useKennelManagement } from '@/hooks/useKennelManagement';
import KennelUnitsTable from '@/components/kennel/components/KennelUnitsTable';
import CleaningScheduleTable from '@/components/kennel/components/CleaningScheduleTable';
import CleaningScheduleEmptyState from '@/components/kennel/components/CleaningScheduleEmptyState';
import CleaningScheduleAddDialog from '@/components/kennel/components/CleaningScheduleAddDialog';
import CleaningScheduleEditDialog from '@/components/kennel/components/CleaningScheduleEditDialog';
import { Button } from '@/components/ui/button';
import { Store, Brush, Building2 } from 'lucide-react';
import { formatDaysOfWeek, formatTime } from '@/components/kennel/utils/scheduleFormatUtils';

interface KennelTabProps {
  onRefreshData: () => void;
}

const KennelTab: React.FC<KennelTabProps> = ({ onRefreshData }) => {
  const [activeTab, setActiveTab] = useState('units');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  
  const { 
    kennelUnits, 
    cleaningSchedules, 
    loading, 
    addCleaningSchedule, 
    updateCleaningSchedule, 
    deleteCleaningSchedule 
  } = useKennelManagement();

  const handleAddCleaningSchedule = async (data) => {
    await addCleaningSchedule(data);
    setIsAddDialogOpen(false);
    onRefreshData();
  };

  const handleUpdateCleaningSchedule = async (data) => {
    if (!editingSchedule) return;
    await updateCleaningSchedule(editingSchedule.id, data);
    setEditingSchedule(null);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Kennel Management</h2>
        <Button onClick={onRefreshData} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="units" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span>Kennel Units</span>
          </TabsTrigger>
          
          <TabsTrigger value="cleaning" className="flex items-center gap-2">
            <Brush className="h-4 w-4" />
            <span>Cleaning Schedules</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="units">
          <Card>
            <CardHeader>
              <CardTitle>Kennel Units</CardTitle>
            </CardHeader>
            <CardContent>
              {kennelUnits.length === 0 ? (
                <div className="text-center p-6">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No kennel units found</h3>
                  <p className="text-muted-foreground mb-4">
                    Go to Facility Management to add kennel units
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/facility'}
                  >
                    Go to Facility Management
                  </Button>
                </div>
              ) : (
                <KennelUnitsTable 
                  kennelUnits={kennelUnits}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  isLoading={loading.units}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cleaning">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cleaning Schedules</CardTitle>
              <CleaningScheduleAddDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                kennelUnits={kennelUnits}
                onSubmit={handleAddCleaningSchedule}
              />
            </CardHeader>
            <CardContent>
              {cleaningSchedules.length === 0 ? (
                <CleaningScheduleEmptyState 
                  onAddClick={() => setIsAddDialogOpen(true)}
                  disabled={kennelUnits.length === 0}
                />
              ) : (
                <CleaningScheduleTable
                  cleaningSchedules={cleaningSchedules}
                  onEdit={setEditingSchedule}
                  onDelete={deleteCleaningSchedule}
                  formatDaysOfWeek={formatDaysOfWeek}
                  formatTime={formatTime}
                />
              )}
            </CardContent>
          </Card>

          <CleaningScheduleEditDialog
            open={!!editingSchedule}
            onOpenChange={(open) => !open && setEditingSchedule(null)}
            editingSchedule={editingSchedule}
            kennelUnits={kennelUnits}
            onSubmit={handleUpdateCleaningSchedule}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KennelTab;
