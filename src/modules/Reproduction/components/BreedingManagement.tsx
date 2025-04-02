
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Heart, AlertTriangle, Check, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useReproductiveCycle } from '@/hooks/useReproductiveCycle';
import { Dog, HeatCycle, BreedingRecord, ReproductiveStatus } from '@/types/reproductive';

interface BreedingManagementProps {
  dog: Dog;
  status: ReproductiveStatus;
  heatCycles: HeatCycle[];
  breedingRecords: BreedingRecord[];
  currentHeatCycle?: HeatCycle | null;
}

interface BreedingFormData {
  sire_id: string;
  tie_date: Date;
  breeding_method: string;
  notes: string;
}

const BreedingManagement: React.FC<BreedingManagementProps> = ({
  dog,
  status,
  heatCycles,
  breedingRecords,
  currentHeatCycle
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedBreedingId, setSelectedBreedingId] = useState<string | null>(null);
  const [breedingForm, setBreedingForm] = useState<BreedingFormData>({
    sire_id: '',
    tie_date: new Date(),
    breeding_method: 'natural',
    notes: ''
  });
  const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null);
  
  const { 
    addBreedingRecord, 
    updateBreedingRecord, 
    isAddingBreeding, 
    isUpdatingBreeding
  } = useReproductiveCycle(dog.id);
  
  // Fetch potential sires
  const { data: sires = [] } = useQuery({
    queryKey: ['potential-sires'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, breed, color, gender')
        .eq('gender', 'Male');
      
      if (error) throw error;
      return data;
    }
  });
  
  const selectedBreeding = breedingRecords.find(record => record.id === selectedBreedingId);
  
  const handleFormChange = (field: keyof BreedingFormData, value: any) => {
    setBreedingForm(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddBreeding = async () => {
    await addBreedingRecord({
      sire_id: breedingForm.sire_id,
      heat_cycle_id: currentHeatCycle?.id,
      tie_date: format(breedingForm.tie_date, 'yyyy-MM-dd'),
      breeding_method: breedingForm.breeding_method,
      notes: breedingForm.notes
    });
    
    setIsAddDialogOpen(false);
    // Reset form
    setBreedingForm({
      sire_id: '',
      tie_date: new Date(),
      breeding_method: 'natural',
      notes: ''
    });
  };
  
  const handleUpdateBreeding = async () => {
    if (!selectedBreedingId) return;
    
    await updateBreedingRecord({
      id: selectedBreedingId,
      data: {
        is_successful: isSuccessful
      }
    });
    
    setIsUpdateDialogOpen(false);
    setSelectedBreedingId(null);
    setIsSuccessful(null);
  };
  
  const openUpdateDialog = (breedingId: string) => {
    setSelectedBreedingId(breedingId);
    setIsUpdateDialogOpen(true);
  };
  
  const canAddBreeding = status === ReproductiveStatus.IN_HEAT && currentHeatCycle;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Breeding Management</h2>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          disabled={!canAddBreeding}
        >
          <Plus className="h-4 w-4 mr-2" />
          Record Breeding
        </Button>
      </div>
      
      {!canAddBreeding && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">Dog Not In Heat</AlertTitle>
          <AlertDescription className="text-amber-600">
            You can only record breeding events when the dog is in heat.
            {status === ReproductiveStatus.PREGNANT && "The dog is currently pregnant."}
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Breeding History</CardTitle>
          <CardDescription>
            {breedingRecords.length > 0 
              ? `${dog.name}'s breeding history`
              : 'No breeding records yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {breedingRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Sire</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Est. Due Date</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {breedingRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.tie_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{record.sire?.name || 'Unknown'}</TableCell>
                    <TableCell className="capitalize">{record.breeding_method || 'Natural'}</TableCell>
                    <TableCell>
                      {record.estimated_due_date 
                        ? format(new Date(record.estimated_due_date), 'MMM d, yyyy')
                        : format(addDays(new Date(record.tie_date), 63), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {record.is_successful === true && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Successful
                        </span>
                      )}
                      {record.is_successful === false && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <X className="h-3 w-3 mr-1" />
                          Unsuccessful
                        </span>
                      )}
                      {record.is_successful === null && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.is_successful === null && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openUpdateDialog(record.id)}
                        >
                          Update Result
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">No Breeding Records</h3>
              <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
                Record breeding events to track mating attempts and manage pregnancies.
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                disabled={!canAddBreeding}
              >
                <Plus className="h-4 w-4 mr-2" />
                Record Breeding
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Breeding Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Breeding</DialogTitle>
            <DialogDescription>
              Enter details about the breeding event.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sire">Sire</Label>
              <Select 
                value={breedingForm.sire_id} 
                onValueChange={(value) => handleFormChange('sire_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sire" />
                </SelectTrigger>
                <SelectContent>
                  {sires.map((sire) => (
                    <SelectItem key={sire.id} value={sire.id}>
                      {sire.name} ({sire.breed})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tie_date">Breeding Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {breedingForm.tie_date ? (
                      format(breedingForm.tie_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={breedingForm.tie_date}
                    onSelect={(date) => handleFormChange('tie_date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="text-muted-foreground text-sm">
                Estimated due date: {format(addDays(breedingForm.tie_date, 63), "PPP")}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="method">Breeding Method</Label>
              <Select 
                value={breedingForm.breeding_method} 
                onValueChange={(value) => handleFormChange('breeding_method', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="artificial_insemination">Artificial Insemination</SelectItem>
                  <SelectItem value="surgical_insemination">Surgical Insemination</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any notes about the breeding"
                value={breedingForm.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddBreeding} 
              disabled={isAddingBreeding || !breedingForm.sire_id}
            >
              {isAddingBreeding ? 'Saving...' : 'Save Breeding Record'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Breeding Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Breeding Result</DialogTitle>
            <DialogDescription>
              Was this breeding successful? This will update the pregnancy status.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="flex justify-center space-x-4">
              <Button
                variant={isSuccessful === true ? "default" : "outline"}
                className={isSuccessful === true ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => setIsSuccessful(true)}
              >
                <Check className="h-4 w-4 mr-2" />
                Successful
              </Button>
              <Button 
                variant={isSuccessful === false ? "default" : "outline"}
                className={isSuccessful === false ? "bg-red-600 hover:bg-red-700" : ""}
                onClick={() => setIsSuccessful(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Unsuccessful
              </Button>
            </div>
            
            {isSuccessful === true && (
              <div className="mt-4">
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    Marking this breeding as successful will update {dog.name}'s status to pregnant
                    and set the tie date to {selectedBreeding ? format(new Date(selectedBreeding.tie_date), 'PPP') : ''}. 
                    The estimated due date will be {selectedBreeding 
                      ? format(addDays(new Date(selectedBreeding.tie_date), 63), 'PPP') 
                      : ''}.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsUpdateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateBreeding} 
              disabled={isUpdatingBreeding || isSuccessful === null}
            >
              {isUpdatingBreeding ? 'Updating...' : 'Update Breeding'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BreedingManagement;
