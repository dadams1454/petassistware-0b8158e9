
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format, differenceInDays, addDays } from 'date-fns';
import { CalendarIcon, Baby, AlertTriangle, Plus } from 'lucide-react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useReproductiveCycle } from '@/hooks/useReproductiveCycle';
import { Dog, PregnancyRecord, BreedingRecord, ReproductiveStatus } from '@/types/reproductive';

interface PregnancyTrackerProps {
  dog: Dog;
  status: ReproductiveStatus;
  pregnancyRecords: PregnancyRecord[];
  breedingRecords: BreedingRecord[];
  estimatedDueDate?: Date | null;
  gestationDays?: number | null;
}

const pregnancyMilestones = [
  { day: 25, title: 'Ultrasound', description: 'Earliest reliable detection of pregnancy' },
  { day: 35, title: 'Fetal Movement', description: 'Puppies begin to move and develop rapidly' },
  { day: 45, title: 'X-Ray Viable', description: 'Skeletal structures visible, can count puppies' },
  { day: 58, title: 'Nesting Behavior', description: 'Prepare whelping box, temperature drops' },
  { day: 63, title: 'Expected Whelping', description: 'Average due date for most dogs' },
  { day: 70, title: 'Overdue Alert', description: 'Consult vet if no whelping by this point' }
];

const PregnancyTracker: React.FC<PregnancyTrackerProps> = ({
  dog,
  status,
  pregnancyRecords,
  breedingRecords,
  estimatedDueDate,
  gestationDays
}) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isWhelpingDialogOpen, setIsWhelpingDialogOpen] = useState(false);
  const [confirmDate, setConfirmDate] = useState<Date>(new Date());
  const [whelpingDate, setWhelpingDate] = useState<Date>(new Date());
  const [whelpingForm, setWhelpingForm] = useState({
    puppies_born: 0,
    puppies_alive: 0,
    complications: '',
    outcome: 'successful',
    notes: ''
  });
  
  const { 
    addPregnancyRecord, 
    updatePregnancyRecord,
    completePregnancy,
    isAddingPregnancy, 
    isUpdatingPregnancy,
    isCompletingPregnancy
  } = useReproductiveCycle(dog.id);
  
  const isPregnant = status === ReproductiveStatus.PREGNANT;
  const currentPregnancy = pregnancyRecords.length > 0 ? pregnancyRecords[0] : null;
  const latestBreeding = breedingRecords.length > 0 ? breedingRecords[0] : null;
  
  const handleConfirmPregnancy = async () => {
    if (!latestBreeding) return;
    
    await addPregnancyRecord({
      dog_id: dog.id,
      breeding_record_id: latestBreeding.id,
      confirmation_date: format(confirmDate, 'yyyy-MM-dd'),
      estimated_whelp_date: latestBreeding.estimated_due_date || 
        format(addDays(new Date(latestBreeding.tie_date), 63), 'yyyy-MM-dd')
    });
    
    setIsConfirmDialogOpen(false);
  };
  
  const handleWhelpingComplete = async () => {
    if (!currentPregnancy) return;
    
    await completePregnancy({
      id: currentPregnancy.id,
      actual_whelp_date: format(whelpingDate, 'yyyy-MM-dd'),
      puppies_born: whelpingForm.puppies_born,
      puppies_alive: whelpingForm.puppies_alive,
      complications: whelpingForm.complications,
      outcome: whelpingForm.outcome,
      notes: whelpingForm.notes
    });
    
    setIsWhelpingDialogOpen(false);
    // Reset form
    setWhelpingForm({
      puppies_born: 0,
      puppies_alive: 0,
      complications: '',
      outcome: 'successful',
      notes: ''
    });
  };
  
  const getMilestoneStatus = (milestoneDay: number) => {
    if (!gestationDays) return 'upcoming';
    if (gestationDays >= milestoneDay) return 'passed';
    if (gestationDays >= milestoneDay - 3) return 'approaching';
    return 'upcoming';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pregnancy Management</h2>
        {!isPregnant && latestBreeding && latestBreeding.is_successful && !currentPregnancy && (
          <Button onClick={() => setIsConfirmDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Confirm Pregnancy
          </Button>
        )}
        {isPregnant && (
          <Button onClick={() => setIsWhelpingDialogOpen(true)}>
            <Baby className="h-4 w-4 mr-2" />
            Record Whelping
          </Button>
        )}
      </div>
      
      {!isPregnant && !latestBreeding && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTriangle className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-700">No Breeding Records</AlertTitle>
          <AlertDescription className="text-blue-600">
            There are no breeding records for this dog. Record a breeding event first to track pregnancy.
          </AlertDescription>
        </Alert>
      )}
      
      {!isPregnant && latestBreeding && !latestBreeding.is_successful && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">No Successful Breeding</AlertTitle>
          <AlertDescription className="text-amber-600">
            The latest breeding has not been marked as successful. Update the breeding record first.
          </AlertDescription>
        </Alert>
      )}
      
      {isPregnant && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Pregnancy</CardTitle>
              <CardDescription>
                {dog.name}'s pregnancy details and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Gestation</h4>
                  <p className="text-2xl font-bold">{gestationDays} days</p>
                  <p className="text-xs text-muted-foreground">of ~63 days</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">Due Date</h4>
                  <p className="text-2xl font-bold">{estimatedDueDate ? format(estimatedDueDate, 'MMM d') : 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">
                    {estimatedDueDate && differenceInDays(estimatedDueDate, new Date())} days remaining
                  </p>
                </div>
              </div>
              
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                <div 
                  className="h-full bg-pink-500 rounded-full"
                  style={{ width: `${Math.min((gestationDays || 0) / 63 * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Key Information</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confirmation Date:</span>
                    <span>{currentPregnancy?.confirmation_date 
                      ? format(new Date(currentPregnancy.confirmation_date), 'MMM d, yyyy') 
                      : 'Not recorded'}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Breeding Date:</span>
                    <span>{dog.tie_date 
                      ? format(new Date(dog.tie_date), 'MMM d, yyyy') 
                      : 'Unknown'}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sire:</span>
                    <span>{latestBreeding?.sire?.name || 'Unknown'}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setIsWhelpingDialogOpen(true)}>
                <Baby className="h-4 w-4 mr-2" />
                Record Whelping
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pregnancy Milestones</CardTitle>
              <CardDescription>
                Important dates and events during pregnancy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <ul className="space-y-4 relative">
                  {pregnancyMilestones.map((milestone) => {
                    const status = getMilestoneStatus(milestone.day);
                    return (
                      <li key={milestone.day} className="relative pl-10">
                        <div
                          className={`absolute left-0 top-1 rounded-full h-8 w-8 flex items-center justify-center ${
                            status === 'passed' 
                              ? 'bg-green-500 text-white' 
                              : status === 'approaching' 
                                ? 'bg-amber-500 text-white' 
                                : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <span className="text-xs font-medium">{milestone.day}</span>
                        </div>
                        <div className={`text-sm ${status === 'passed' ? 'text-green-800' : ''}`}>
                          <HoverCard>
                            <HoverCardTrigger className="cursor-default">
                              <h4 className="font-medium">
                                Day {milestone.day}: {milestone.title}
                                {status === 'approaching' && (
                                  <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                    Approaching
                                  </span>
                                )}
                              </h4>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">{milestone.title}</h4>
                                <p className="text-sm">{milestone.description}</p>
                                {dog.tie_date && (
                                  <p className="text-xs text-muted-foreground">
                                    Expected date: {format(addDays(new Date(dog.tie_date), milestone.day), 'MMM d, yyyy')}
                                  </p>
                                )}
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {pregnancyRecords.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pregnancy History</CardTitle>
            <CardDescription>Previous pregnancies and outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Confirmation Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actual Whelp Date</TableHead>
                  <TableHead>Puppies Born</TableHead>
                  <TableHead>Puppies Survived</TableHead>
                  <TableHead>Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pregnancyRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {record.confirmation_date 
                        ? format(new Date(record.confirmation_date), 'MMM d, yyyy') 
                        : 'Not recorded'}
                    </TableCell>
                    <TableCell>
                      {record.estimated_whelp_date 
                        ? format(new Date(record.estimated_whelp_date), 'MMM d, yyyy')
                        : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {record.actual_whelp_date 
                        ? format(new Date(record.actual_whelp_date), 'MMM d, yyyy')
                        : 'Not yet'}
                    </TableCell>
                    <TableCell>{record.puppies_born || 'N/A'}</TableCell>
                    <TableCell>{record.puppies_alive || 'N/A'}</TableCell>
                    <TableCell className="capitalize">
                      {record.outcome || (record.actual_whelp_date ? 'Completed' : 'In progress')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Confirm Pregnancy Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Pregnancy</DialogTitle>
            <DialogDescription>
              Record pregnancy confirmation details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmation-date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {confirmDate ? (
                        format(confirmDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={confirmDate}
                      onSelect={(date) => setConfirmDate(date!)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {latestBreeding && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800 text-sm">
                  Based on the breeding date of {format(new Date(latestBreeding.tie_date), 'MMM d, yyyy')}, 
                  the estimated due date will be {format(addDays(new Date(latestBreeding.tie_date), 63), 'MMM d, yyyy')}.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmPregnancy} 
              disabled={isAddingPregnancy}
            >
              {isAddingPregnancy ? 'Saving...' : 'Confirm Pregnancy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Whelping Dialog */}
      <Dialog open={isWhelpingDialogOpen} onOpenChange={setIsWhelpingDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Record Whelping</DialogTitle>
            <DialogDescription>
              Record whelping details and puppy information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whelping-date" className="text-right">
                Whelping Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {whelpingDate ? (
                        format(whelpingDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={whelpingDate}
                      onSelect={(date) => setWhelpingDate(date!)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="puppies-born" className="text-right">
                Puppies Born
              </Label>
              <div className="col-span-3">
                <Input
                  id="puppies-born"
                  type="number"
                  min="0"
                  value={whelpingForm.puppies_born}
                  onChange={(e) => setWhelpingForm({
                    ...whelpingForm,
                    puppies_born: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="puppies-alive" className="text-right">
                Puppies Alive
              </Label>
              <div className="col-span-3">
                <Input
                  id="puppies-alive"
                  type="number"
                  min="0"
                  max={whelpingForm.puppies_born}
                  value={whelpingForm.puppies_alive}
                  onChange={(e) => setWhelpingForm({
                    ...whelpingForm,
                    puppies_alive: Math.min(parseInt(e.target.value) || 0, whelpingForm.puppies_born)
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="outcome" className="text-right">
                Outcome
              </Label>
              <div className="col-span-3">
                <Select
                  value={whelpingForm.outcome}
                  onValueChange={(value) => setWhelpingForm({
                    ...whelpingForm,
                    outcome: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="complications">With Complications</SelectItem>
                    <SelectItem value="c_section">C-Section Required</SelectItem>
                    <SelectItem value="unsuccessful">Unsuccessful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="complications" className="text-right">
                Complications
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="complications"
                  placeholder="Any complications during whelping"
                  value={whelpingForm.complications}
                  onChange={(e) => setWhelpingForm({
                    ...whelpingForm,
                    complications: e.target.value
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="notes"
                  placeholder="Additional notes about the whelping"
                  value={whelpingForm.notes}
                  onChange={(e) => setWhelpingForm({
                    ...whelpingForm,
                    notes: e.target.value
                  })}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsWhelpingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleWhelpingComplete} 
              disabled={isCompletingPregnancy}
            >
              {isCompletingPregnancy ? 'Saving...' : 'Record Whelping'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PregnancyTracker;
