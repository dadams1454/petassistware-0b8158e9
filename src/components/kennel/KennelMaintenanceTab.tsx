import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, Check } from 'lucide-react';
import { KennelMaintenance, KennelUnit } from '@/types/kennel';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import KennelMaintenanceForm from './forms/KennelMaintenanceForm';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/standardized';
import { format, parseISO } from 'date-fns';

interface KennelMaintenanceTabProps {
  maintenanceRecords: KennelMaintenance[];
  kennelUnits: KennelUnit[];
  loading: boolean;
  addMaintenanceRecord: (maintenance: Omit<KennelMaintenance, 'id' | 'created_at'>) => Promise<KennelMaintenance>;
  updateMaintenanceRecord: (id: string, updates: Partial<KennelMaintenance>) => Promise<KennelMaintenance>;
}

const KennelMaintenanceTab: React.FC<KennelMaintenanceTabProps> = ({ 
  maintenanceRecords, 
  kennelUnits,
  loading,
  addMaintenanceRecord,
  updateMaintenanceRecord
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddMaintenanceRecord = async (data: Omit<KennelMaintenance, 'id' | 'created_at'>) => {
    await addMaintenanceRecord(data);
    setIsAddDialogOpen(false);
  };

  const handleCompleteMaintenanceRecord = async (id: string) => {
    await updateMaintenanceRecord(id, { status: 'completed' });
  };

  const getStatusColor = (status: KennelMaintenance['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'deferred':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const activeMaintenanceRecords = maintenanceRecords.filter(record => 
    record.status === 'scheduled' || record.status === 'in-progress'
  );
  
  const completedMaintenanceRecords = maintenanceRecords.filter(record => 
    record.status === 'completed' || record.status === 'deferred'
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Maintenance Records</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={kennelUnits.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add Maintenance Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Maintenance Record</DialogTitle>
            </DialogHeader>
            <KennelMaintenanceForm 
              onSubmit={handleAddMaintenanceRecord} 
              kennelUnits={kennelUnits}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {maintenanceRecords.length === 0 ? (
          <EmptyState 
            title="No Maintenance Records" 
            description="Add maintenance records to track kennel upkeep."
            icon={<Wrench className="h-12 w-12 text-muted-foreground" />}
            action={{
              label: "Add Maintenance Record",
              onClick: () => setIsAddDialogOpen(true),
              disabled: kennelUnits.length === 0
            }}
          />
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Active Maintenance</h3>
              {activeMaintenanceRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No active maintenance tasks.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Kennel Unit</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Performed By</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeMaintenanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{format(parseISO(record.maintenance_date), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="font-medium">{record.kennel_unit?.name || '-'}</TableCell>
                          <TableCell>{record.maintenance_type}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(record.status)}>
                              {record.status.split('-').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.performed_by}</TableCell>
                          <TableCell className="text-right">
                            {record.status !== 'completed' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCompleteMaintenanceRecord(record.id)}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Mark Complete
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Completed Maintenance</h3>
              {completedMaintenanceRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No completed maintenance records.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Kennel Unit</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Performed By</TableHead>
                        <TableHead>Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedMaintenanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{format(parseISO(record.maintenance_date), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="font-medium">{record.kennel_unit?.name || '-'}</TableCell>
                          <TableCell>{record.maintenance_type}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(record.status)}>
                              {record.status.split('-').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.performed_by}</TableCell>
                          <TableCell>{record.cost ? `$${record.cost.toFixed(2)}` : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KennelMaintenanceTab;
