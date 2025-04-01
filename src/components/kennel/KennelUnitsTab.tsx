
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
import { Plus, Edit, Trash, Store } from 'lucide-react';
import { KennelUnit } from '@/types/kennel';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import KennelUnitForm from './forms/KennelUnitForm';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/standardized';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface KennelUnitsTabProps {
  kennelUnits: KennelUnit[];
  loading: boolean;
  addKennelUnit: (kennelUnit: Omit<KennelUnit, 'id' | 'created_at'>) => Promise<KennelUnit>;
  updateKennelUnit: (id: string, updates: Partial<KennelUnit>) => Promise<KennelUnit>;
  deleteKennelUnit: (id: string) => Promise<void>;
}

const KennelUnitsTab: React.FC<KennelUnitsTabProps> = ({ 
  kennelUnits, 
  loading,
  addKennelUnit,
  updateKennelUnit,
  deleteKennelUnit
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<KennelUnit | null>(null);

  const handleAddUnit = async (data: Omit<KennelUnit, 'id' | 'created_at'>) => {
    await addKennelUnit(data);
    setIsAddDialogOpen(false);
  };

  const handleUpdateUnit = async (data: Partial<KennelUnit>) => {
    if (!editingUnit) return;
    await updateKennelUnit(editingUnit.id, data);
    setEditingUnit(null);
  };

  const getStatusColor = (status: KennelUnit['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'occupied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'cleaning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kennel Units</CardTitle>
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
        <CardTitle>Kennel Units</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Kennel Unit</DialogTitle>
            </DialogHeader>
            <KennelUnitForm onSubmit={handleAddUnit} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {kennelUnits.length === 0 ? (
          <EmptyState 
            title="No Kennel Units Found" 
            description="Add your first kennel unit to get started."
            icon={<Store className="h-12 w-12 text-muted-foreground" />}
            action={
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kennelUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell>{unit.unit_type}</TableCell>
                    <TableCell>{unit.location || '-'}</TableCell>
                    <TableCell>{unit.capacity}</TableCell>
                    <TableCell>{unit.size || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(unit.status)}>
                        {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog open={editingUnit?.id === unit.id} onOpenChange={(open) => !open && setEditingUnit(null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditingUnit(unit)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Kennel Unit</DialogTitle>
                            </DialogHeader>
                            {editingUnit && (
                              <KennelUnitForm 
                                onSubmit={handleUpdateUnit} 
                                defaultValues={editingUnit}
                                isEditing
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Kennel Unit</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the kennel unit "{unit.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteKennelUnit(unit.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KennelUnitsTab;
