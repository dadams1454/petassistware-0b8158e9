import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Litter, Puppy } from '@/types/litter';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import PuppyCareLog from '@/components/puppies/dashboard/PuppyCareLog';

const PuppyTestingDashboard = () => {
  const [litterId, setLitterId] = useState<string>('');
  const [selectedPuppyId, setSelectedPuppyId] = useState<string | null>(null);
  const [isAddingLitter, setIsAddingLitter] = useState<boolean>(false);
  const [isEditingLitter, setIsEditingLitter] = useState<boolean>(false);
  const [litterName, setLitterName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date());
  const [damId, setDamId] = useState<string>('');
  const [sireId, setSireId] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch Litters
  const { data: litters, isLoading: isLittersLoading, refetch: refetchLitters } = useQuery({
    queryKey: ['litters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Fetch Puppies for Selected Litter
  const { data: puppies, isLoading: isPuppiesLoading, refetch: refetchPuppyData } = useQuery({
    queryKey: ['puppies', litterId],
    queryFn: async () => {
      if (!litterId) return [];
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .eq('litter_id', litterId);
      if (error) throw error;
      return data;
    },
    enabled: !!litterId,
  });

  // Fetch Litter Details
  const { data: litter, isLoading: isLitterLoading } = useQuery({
    queryKey: ['litter', litterId],
    queryFn: async () => {
      if (!litterId) return null;
      const { data, error } = await supabase
        .from('litters')
        .select('*')
        .eq('id', litterId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!litterId,
  });

  // Add Litter Mutation
  const addLitterMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .insert({
          litter_name: litterName,
          birth_date: birthDate ? format(birthDate, 'yyyy-MM-dd') : null,
          dam_id: damId,
          sire_id: sireId,
        });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Litter Added',
        description: 'New litter has been added successfully.',
      });
      setIsAddingLitter(false);
      setLitterName('');
      setBirthDate(undefined);
      setDamId('');
      setSireId('');
      refetchLitters();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add litter.',
        variant: 'destructive',
      });
    },
  });

  // Update Litter Mutation
  const updateLitterMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .update({
          litter_name: litterName,
          birth_date: birthDate ? format(birthDate, 'yyyy-MM-dd') : null,
          dam_id: damId,
          sire_id: sireId,
        })
        .eq('id', litterId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Litter Updated',
        description: 'Litter has been updated successfully.',
      });
      setIsEditingLitter(false);
      refetchLitters();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update litter.',
        variant: 'destructive',
      });
    },
  });

  // Delete Litter Mutation
  const deleteLitterMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .delete()
        .eq('id', litterId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Litter Deleted',
        description: 'Litter has been deleted successfully.',
      });
      setLitterId('');
      setIsDeleteDialogOpen(false);
      refetchLitters();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete litter.',
        variant: 'destructive',
      });
    },
  });

  const handleAddLitter = async () => {
    await addLitterMutation.mutateAsync();
  };

  const handleUpdateLitter = async () => {
    await updateLitterMutation.mutateAsync();
  };

  const handleDeleteLitter = async () => {
    await deleteLitterMutation.mutateAsync();
  };

  const getSelectedPuppy = useCallback(() => {
    if (!selectedPuppyId || !puppies) return null;
    return puppies.find((puppy) => puppy.id === selectedPuppyId);
  }, [selectedPuppyId, puppies]);

  const handleCareLogAdded = () => {
    refetchPuppyData();
  };

  const columns: ColumnDef<Puppy>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
    },
    {
      accessorKey: 'color',
      header: 'Color',
    },
    {
      accessorKey: 'birth_date',
      header: 'Birth Date',
      cell: ({ row }) => {
        const date = row.getValue('birth_date');
        return date ? format(new Date(date as string), 'MM/dd/yyyy') : 'Unknown';
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue('status')}</Badge>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Litter Management</CardTitle>
          <CardDescription>
            Add, edit, and manage litters and their puppies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="litter-select">Select Litter</Label>
              <select
                id="litter-select"
                className="w-full p-2 border rounded"
                value={litterId}
                onChange={(e) => setLitterId(e.target.value)}
              >
                <option value="">Select a litter</option>
                {litters &&
                  litters.map((litter: any) => (
                    <option key={litter.id} value={litter.id}>
                      {litter.litter_name || 'Unnamed Litter'}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-end justify-end">
              <Button onClick={() => setIsAddingLitter(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Litter
              </Button>
            </div>
          </div>

          {litterId && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {litter?.litter_name || 'Selected Litter'} Details
                </h3>
                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditingLitter(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Litter
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Litter
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the litter and all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            onClick={() => setIsDeleteDialogOpen(true)}
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <Separator />
            </div>
          )}

          {puppies && puppies.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Puppies in Litter</h3>
              <DataTable columns={columns} data={puppies} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Litter Add/Edit Modal */}
      {(isAddingLitter || isEditingLitter) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Card className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <CardHeader>
              <CardTitle>{isAddingLitter ? 'Add New Litter' : 'Edit Litter'}</CardTitle>
              <CardDescription>
                {isAddingLitter
                  ? 'Enter the details for the new litter.'
                  : 'Update the details for the selected litter.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="litter-name">Litter Name</Label>
                <Input
                  type="text"
                  id="litter-name"
                  placeholder="Litter Name"
                  value={litterName}
                  onChange={(e) => setLitterName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Birth Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !birthDate && "text-muted-foreground"
                      )}
                    >
                      {birthDate ? (
                        format(birthDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      className="border-none shadow-none"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dam-id">Dam ID</Label>
                <Input
                  type="text"
                  id="dam-id"
                  placeholder="Dam ID"
                  value={damId}
                  onChange={(e) => setDamId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sire-id">Sire ID</Label>
                <Input
                  type="text"
                  id="sire-id"
                  placeholder="Sire ID"
                  value={sireId}
                  onChange={(e) => setSireId(e.target.value)}
                />
              </div>
            </CardContent>
            <div className="flex justify-end space-x-2 p-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddingLitter(false);
                  setIsEditingLitter(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (isAddingLitter) {
                    handleAddLitter();
                  } else if (isEditingLitter) {
                    handleUpdateLitter();
                  }
                }}
                disabled={addLitterMutation.isPending || updateLitterMutation.isPending}
              >
                {addLitterMutation.isPending || updateLitterMutation.isPending ? (
                  <>
                    Saving...
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Litter Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              litter and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                onClick={handleDeleteLitter}
                disabled={deleteLitterMutation.isPending}
              >
                {deleteLitterMutation.isPending ? (
                  <>
                    Deleting...
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </AlertDialogTrigger>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Litter Details</TabsTrigger>
          <TabsTrigger value="puppies">Puppies</TabsTrigger>
          <TabsTrigger value="care">Care Log</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          {isLitterLoading ? (
            <p>Loading litter details...</p>
          ) : litter ? (
            <div className="space-y-2">
              <p>Litter Name: {litter.litter_name}</p>
              <p>Birth Date: {litter.birth_date}</p>
              <p>Dam ID: {litter.dam_id}</p>
              <p>Sire ID: {litter.sire_id}</p>
            </div>
          ) : (
            <p>No litter details to display.</p>
          )}
        </TabsContent>
        <TabsContent value="puppies">
          {isPuppiesLoading ? (
            <p>Loading puppies...</p>
          ) : puppies && puppies.length > 0 ? (
            <DataTable columns={columns} data={puppies} />
          ) : (
            <p>No puppies in this litter.</p>
          )}
        </TabsContent>
        <TabsContent value="care">
          <PuppyCareLog 
            puppyId={selectedPuppyId} 
            puppyName={getSelectedPuppy()?.name || 'Puppy'}
            puppyGender={getSelectedPuppy()?.gender || 'Unknown'}
            puppyColor={getSelectedPuppy()?.color || 'Unknown'}
            puppyAge={litter?.birth_date 
              ? differenceInDays(new Date(), new Date(litter.birth_date))
              : 0}
            onSuccess={handleCareLogAdded}
            onRefresh={() => refetchPuppyData()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PuppyTestingDashboard;
