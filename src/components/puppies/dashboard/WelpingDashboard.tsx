import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, subDays, addDays } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Plus, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { PuppyCareLog } from './PuppyCareLog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SectionHeader } from '@/components/ui/standardized';
import { Puppy } from '@/types/puppy';

interface PuppyCareLogEntry {
  id: string;
  puppy_id: string;
  care_type: string;
  timestamp: string;
  details: any;
  notes: string | null;
  created_at: string;
}

interface WelpingDashboardProps {
  litterId: string;
}

const WelpingDashboard: React.FC<WelpingDashboardProps> = ({ litterId }) => {
  const [isAddPuppyOpen, setIsAddPuppyOpen] = useState(false);
  const [newPuppyName, setNewPuppyName] = useState('');
  const [newPuppyGender, setNewPuppyGender] = useState('Male');
  const [newPuppyColor, setNewPuppyColor] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedPuppyId, setSelectedPuppyId] = useState<string | null>(null);
  const [isEditPuppyOpen, setIsEditPuppyOpen] = useState(false);
  const [editPuppyName, setEditPuppyName] = useState('');
  const [editPuppyGender, setEditPuppyGender] = useState('Male');
  const [editPuppyColor, setEditPuppyColor] = useState('');
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: puppies, isLoading, error, refetch: refreshData } = useQuery({
    queryKey: ['puppies', litterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .eq('litter_id', litterId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching puppies:', error);
        throw error;
      }
      return data as Puppy[];
    },
  });

  const { data: careLogs, isLoading: isCareLogsLoading, error: careLogsError, refetch: refetchCareLogs } = useQuery({
    queryKey: ['puppyCareLogs', litterId, dateRange?.from, dateRange?.to],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) {
        return [];
      }

      const fromDate = format(dateRange.from, 'yyyy-MM-dd');
      const toDate = format(dateRange.to, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('puppy_care_logs')
        .select('*')
        .in('puppy_id', puppies ? puppies.map(puppy => puppy.id) : [])
        .gte('timestamp', fromDate)
        .lte('timestamp', toDate)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching puppy care logs:', error);
        throw error;
      }
      return data as PuppyCareLogEntry[];
    },
    enabled: !!puppies && puppies.length > 0 && !!dateRange?.from && !!dateRange?.to,
  });

  const { mutate: addPuppy, isLoading: isAddingPuppy } = useMutation(
    async () => {
      const { data, error } = await supabase
        .from('puppies')
        .insert([{ litter_id: litterId, name: newPuppyName, gender: newPuppyGender, color: newPuppyColor }])
        .select()
        .single();

      if (error) {
        console.error('Error adding puppy:', error);
        throw error;
      }
      return data;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Puppy added',
          description: `${newPuppyName} has been added to the litter.`,
        });
        setIsAddPuppyOpen(false);
        setNewPuppyName('');
        setNewPuppyGender('Male');
        setNewPuppyColor('');
        refreshData();
      },
      onError: (err: any) => {
        toast({
          title: 'Error adding puppy',
          description: err.message,
          variant: 'destructive',
        });
      },
    }
  );

  const { mutate: editPuppy, isLoading: isEditingPuppy } = useMutation(
    async () => {
      if (!selectedPuppyId) {
        throw new Error('No puppy selected to edit.');
      }

      const { data, error } = await supabase
        .from('puppies')
        .update({ name: editPuppyName, gender: editPuppyGender, color: editPuppyColor })
        .eq('id', selectedPuppyId)
        .select()
        .single();

      if (error) {
        console.error('Error editing puppy:', error);
        throw error;
      }
      return data;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Puppy updated',
          description: `${editPuppyName} has been updated.`,
        });
        setIsEditPuppyOpen(false);
        setEditPuppyName('');
        setEditPuppyGender('Male');
        setEditPuppyColor('');
        setSelectedPuppyId(null);
        refreshData();
      },
      onError: (err: any) => {
        toast({
          title: 'Error updating puppy',
          description: err.message,
          variant: 'destructive',
        });
      },
    }
  );

  const { mutate: deletePuppy, isLoading: isDeletingPuppy } = useMutation(
    async () => {
      if (!selectedPuppyId) {
        throw new Error('No puppy selected to delete.');
      }

      const { data, error } = await supabase
        .from('puppies')
        .delete()
        .eq('id', selectedPuppyId);

      if (error) {
        console.error('Error deleting puppy:', error);
        throw error;
      }
      return data;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Puppy deleted',
          description: 'Puppy has been deleted successfully.',
        });
        setIsDeleteConfirmationOpen(false);
        setSelectedPuppyId(null);
        refreshData();
      },
      onError: (err: any) => {
        toast({
          title: 'Error deleting puppy',
          description: err.message,
          variant: 'destructive',
        });
      },
    }
  );

  const handleAddPuppy = () => {
    addPuppy();
  };

  const handleEditPuppy = () => {
    editPuppy();
  };

  const handleDeletePuppy = () => {
    deletePuppy();
  };

  const handleOpenEditPuppyDialog = (puppy: Puppy) => {
    setSelectedPuppyId(puppy.id);
    setEditPuppyName(puppy.name);
    setEditPuppyGender(puppy.gender);
    setEditPuppyColor(puppy.color);
    setIsEditPuppyOpen(true);
  };

  const handleOpenDeleteConfirmation = (puppy: Puppy) => {
    setSelectedPuppyId(puppy.id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setIsDatePickerOpen(false);
  };

  useEffect(() => {
    if (puppies && puppies.length > 0) {
      refetchCareLogs();
    }
  }, [puppies, dateRange, refetchCareLogs]);

  const calculateAgeInDays = (createdAt: string): number => {
    const birthDate = new Date(createdAt);
    const today = new Date();
    const diffInTime = today.getTime() - birthDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    return diffInDays;
  };

  if (isLoading) return <div>Loading puppies...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <SectionHeader
        title="Welping Dashboard"
        description="Manage and track the care of newborn puppies"
        action={{
          label: "Add Puppy",
          onClick: () => setIsAddPuppyOpen(true),
          icon: <Plus className="h-4 w-4 mr-2" />
        }}
      />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Puppy List</CardTitle>
          <CardDescription>
            Manage puppies in this litter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Age (Days)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {puppies?.map((puppy) => (
                <TableRow key={puppy.id}>
                  <TableCell>{puppy.name}</TableCell>
                  <TableCell>{puppy.gender}</TableCell>
                  <TableCell>{puppy.color}</TableCell>
                  <TableCell>{calculateAgeInDays(puppy.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenEditPuppyDialog(puppy)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleOpenDeleteConfirmation(puppy)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Care Logs</CardTitle>
          <CardDescription>
            View and manage care logs for puppies in this litter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[300px] justify-start text-left font-normal',
                    !dateRange?.from && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(
                        dateRange.to,
                        'MMM dd, yyyy'
                      )}`
                    ) : (
                      format(dateRange.from, 'MMM dd, yyyy')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button onClick={refreshData} disabled={isLoading}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
          </div>

          {puppies?.map((puppy) => (
            <PuppyCareLog
              puppyId={puppy.id}
              puppyName={puppy.name} 
              puppyGender={puppy.gender}
              puppyColor={puppy.color}
              puppyAge={calculateAgeInDays(puppy.created_at)}
              onSuccess={refreshData}
              onRefresh={refreshData}
            />
          ))}
        </CardContent>
      </Card>

      {/* Add Puppy Dialog */}
      <Dialog open={isAddPuppyOpen} onOpenChange={setIsAddPuppyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Puppy</DialogTitle>
            <DialogDescription>
              Add a new puppy to the litter.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newPuppyName}
                onChange={(e) => setNewPuppyName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Gender
              </Label>
              <Select value={newPuppyGender} onValueChange={setNewPuppyGender}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Input
                id="color"
                value={newPuppyColor}
                onChange={(e) => setNewPuppyColor(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsAddPuppyOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddPuppy} disabled={isAddingPuppy}>
              {isAddingPuppy ? "Adding..." : "Add Puppy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Puppy Dialog */}
      <Dialog open={isEditPuppyOpen} onOpenChange={() => setIsEditPuppyOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Puppy</DialogTitle>
            <DialogDescription>
              Edit the details of the selected puppy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editPuppyName}
                onChange={(e) => setEditPuppyName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-gender" className="text-right">
                Gender
              </Label>
              <Select value={editPuppyGender} onValueChange={setEditPuppyGender}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-color" className="text-right">
                Color
              </Label>
              <Input
                id="edit-color"
                value={editPuppyColor}
                onChange={(e) => setEditPuppyColor(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditPuppyOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditPuppy} disabled={isEditingPuppy}>
              {isEditingPuppy ? "Updating..." : "Update Puppy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmationOpen} onOpenChange={() => setIsDeleteConfirmationOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Puppy</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this puppy? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDeleteConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" onClick={handleDeletePuppy} disabled={isDeletingPuppy}>
              {isDeletingPuppy ? "Deleting..." : "Delete Puppy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WelpingDashboard;
