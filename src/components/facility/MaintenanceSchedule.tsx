
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wrench } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MaintenanceSchedule: React.FC = () => {
  const { toast } = useToast();
  
  const handleAddMaintenanceTask = () => {
    toast({
      title: "Coming Soon",
      description: "Maintenance task management will be implemented in a future update."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Wrench className="mr-2 h-5 w-5" />
            Maintenance Schedule
          </CardTitle>
          <Button onClick={handleAddMaintenanceTask} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Maintenance Task
          </Button>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Maintenance Schedule Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This feature will allow you to schedule and track regular maintenance tasks for your facility,
              equipment, and kennel infrastructure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceSchedule;
