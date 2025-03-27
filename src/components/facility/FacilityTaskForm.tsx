
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FacilityTaskDialog from './FacilityTaskDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface FacilityArea {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

const FacilityTaskForm = () => {
  const { toast } = useToast();
  const [areas, setAreas] = useState<FacilityArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('facility_areas')
          .select('*')
          .order('name');

        if (error) throw error;
        setAreas(data || []);
      } catch (err) {
        console.error('Error fetching facility areas:', err);
        toast({
          title: 'Error',
          description: 'Failed to load facility areas',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAreas();
  }, [toast]);

  const handleTaskAdded = () => {
    setIsDialogOpen(false);
    // You can add an onSuccess callback prop if you need to refresh a parent component
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Add New Task</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)} size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Create facility maintenance tasks to keep track of regular duties.
        </p>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Facility Task</DialogTitle>
            </DialogHeader>
            <FacilityTaskDialog
              taskId={null}
              areas={areas}
              onSuccess={handleTaskAdded}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FacilityTaskForm;
