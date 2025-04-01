import React, { useState, useEffect } from 'react';
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
import { Plus, UserMinus, Building2 } from 'lucide-react';
import { KennelAssignment, KennelUnit } from '@/types/kennel';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import KennelAssignmentForm from './forms/KennelAssignmentForm';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/standardized';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface KennelAssignmentsTabProps {
  kennelAssignments: KennelAssignment[];
  kennelUnits: KennelUnit[];
  loading: boolean;
  addKennelAssignment: (assignment: Omit<KennelAssignment, 'id' | 'created_at'>) => Promise<KennelAssignment>;
  endKennelAssignment: (id: string, kennelUnitId: string) => Promise<KennelAssignment>;
}

const KennelAssignmentsTab: React.FC<KennelAssignmentsTabProps> = ({ 
  kennelAssignments, 
  kennelUnits,
  loading,
  addKennelAssignment,
  endKennelAssignment
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [availableDogs, setAvailableDogs] = useState<any[]>([]);
  const [loadingDogs, setLoadingDogs] = useState(false);
  
  // Filter to show only active assignments (where end_date is null)
  const activeAssignments = kennelAssignments.filter(assignment => !assignment.end_date);
  // Filter to show only past assignments (where end_date is not null)
  const pastAssignments = kennelAssignments.filter(assignment => assignment.end_date);
  
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

  const handleAddAssignment = async (data: Omit<KennelAssignment, 'id' | 'created_at'>) => {
    await addKennelAssignment(data);
    setIsAddDialogOpen(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kennel Assignments</CardTitle>
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
        <CardTitle>Kennel Assignments</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={availableKennelUnits.length === 0 || availableDogs.length === 0}>
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
      </CardHeader>
      <CardContent>
        {kennelAssignments.length === 0 ? (
          <EmptyState 
            title="No Kennel Assignments" 
            description="Assign dogs to kennels to see them here."
            icon={<Building2 className="h-12 w-12 text-muted-foreground" />}
            action={{
              label: "Assign Dog",
              onClick: () => setIsAddDialogOpen(true),
              disabled: availableKennelUnits.length === 0 || availableDogs.length === 0
            }}
          />
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Active Assignments</h3>
              {activeAssignments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No active kennel assignments.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dog</TableHead>
                        <TableHead>Kennel Unit</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Assigned</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeAssignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{assignment.dog?.name || '-'}</TableCell>
                          <TableCell>{assignment.kennel_unit?.name || '-'}</TableCell>
                          <TableCell>{assignment.kennel_unit?.location || '-'}</TableCell>
                          <TableCell>{format(parseISO(assignment.start_date), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{assignment.notes || '-'}</TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  End Assignment
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>End Kennel Assignment</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to end the kennel assignment for {assignment.dog?.name}? 
                                    This will mark the kennel unit as available.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => endKennelAssignment(assignment.id, assignment.kennel_unit_id)}
                                  >
                                    End Assignment
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Past Assignments</h3>
              {pastAssignments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No past kennel assignments.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dog</TableHead>
                        <TableHead>Kennel Unit</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastAssignments.map((assignment) => {
                        const startDate = parseISO(assignment.start_date);
                        const endDate = assignment.end_date ? parseISO(assignment.end_date) : new Date();
                        const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
                        
                        return (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.dog?.name || '-'}</TableCell>
                            <TableCell>{assignment.kennel_unit?.name || '-'}</TableCell>
                            <TableCell>{format(startDate, 'MMM d, yyyy')}</TableCell>
                            <TableCell>{assignment.end_date ? format(endDate, 'MMM d, yyyy') : '-'}</TableCell>
                            <TableCell>{durationDays} days</TableCell>
                            <TableCell>{assignment.notes || '-'}</TableCell>
                          </TableRow>
                        );
                      })}
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

export default KennelAssignmentsTab;
