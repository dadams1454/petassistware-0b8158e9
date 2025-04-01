
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/standardized';
import { useKennelManagement } from '@/hooks/useKennelManagement';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import KennelAssignmentForm from '@/components/kennel/forms/KennelAssignmentForm';
import { supabase } from '@/integrations/supabase/client';

const KennelAssignmentsWidget = () => {
  const [availableDogs, setAvailableDogs] = useState<any[]>([]);
  const [loadingDogs, setLoadingDogs] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { 
    kennelAssignments, 
    kennelUnits,
    loading, 
    addKennelAssignment,
    endKennelAssignment 
  } = useKennelManagement();

  // Get active assignments (where end_date is null)
  const activeAssignments = kennelAssignments.filter(assignment => !assignment.end_date);
  
  // Get available kennel units (status === 'available')
  const availableKennelUnits = kennelUnits.filter(unit => unit.status === 'available');

  useEffect(() => {
    const fetchDogs = async () => {
      setLoadingDogs(true);
      try {
        // Get all dogs
        const { data: allDogs, error: dogsError } = await supabase
          .from('dogs')
          .select('id, name, breed, gender')
          .order('name');
        
        if (dogsError) throw dogsError;
        
        // Get all dogs with active assignments
        const { data: activeDogIds, error: assignmentsError } = await supabase
          .from('kennel_assignments')
          .select('dog_id')
          .is('end_date', null);
        
        if (assignmentsError) throw assignmentsError;
        
        // Filter out dogs that already have active assignments
        const activeDogIdSet = new Set(activeDogIds.map(item => item.dog_id));
        const availableDogs = allDogs.filter(dog => !activeDogIdSet.has(dog.id));
        
        setAvailableDogs(availableDogs);
      } catch (error) {
        console.error('Error fetching available dogs:', error);
      } finally {
        setLoadingDogs(false);
      }
    };
    
    fetchDogs();
  }, [kennelAssignments]);

  const handleAddAssignment = async (data) => {
    await addKennelAssignment(data);
    setIsAddDialogOpen(false);
  };

  const handleViewAll = () => {
    navigate('/facility', { state: { activeTab: 'kennels' } });
  };

  if (loading.assignments || loading.units) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span>Kennel Assignments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          <span>Kennel Assignments</span>
        </CardTitle>
        <div className="flex space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={availableKennelUnits.length === 0 || availableDogs.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Assign Dog
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Dog to Kennel</DialogTitle>
              </DialogHeader>
              <KennelAssignmentForm 
                onSubmit={handleAddAssignment} 
                availableDogs={availableDogs}
                availableKennelUnits={availableKennelUnits}
                loadingDogs={loadingDogs}
              />
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="ghost" onClick={handleViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeAssignments.length === 0 ? (
          <EmptyState 
            title="No Active Kennel Assignments" 
            description="Assign dogs to kennels to see them here."
            icon={<Home className="h-12 w-12 text-muted-foreground" />}
            action={{
              label: "Assign Dog",
              onClick: () => setIsAddDialogOpen(true),
              disabled: availableKennelUnits.length === 0 || availableDogs.length === 0
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dog</TableHead>
                  <TableHead>Kennel Unit</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeAssignments.slice(0, 5).map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.dog?.name || '-'}</TableCell>
                    <TableCell>{assignment.kennel_unit?.name || '-'}</TableCell>
                    <TableCell>{assignment.kennel_unit?.location || '-'}</TableCell>
                    <TableCell>{format(parseISO(assignment.start_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => endKennelAssignment(assignment.id, assignment.kennel_unit_id)}
                      >
                        End
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {activeAssignments.length > 5 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <Button variant="link" onClick={handleViewAll}>
                        View {activeAssignments.length - 5} more assignments...
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KennelAssignmentsWidget;
