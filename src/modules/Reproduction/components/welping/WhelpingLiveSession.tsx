
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, formatDistanceToNow, differenceInMinutes, differenceInHours } from 'date-fns';
import { Camera, Save, Clock, Plus, ArrowLeft, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { uploadPhoto, resizeImage } from '@/utils/imageUpload';
import { toast } from 'sonner';

interface Puppy {
  id: string;
  litter_id: string;
  gender: 'Male' | 'Female';
  color: string;
  birth_weight: string;
  weight_unit: 'oz' | 'g' | 'lbs' | 'kg';
  birth_time: string;
  birth_order: number;
  photo_url?: string;
  notes?: string;
}

interface ShiftLog {
  id?: string;
  litter_id: string;
  attended_by: string;
  notes?: string;
  timestamp: string;
}

interface PuppyFormData {
  gender: 'Male' | 'Female';
  color: string;
  birth_weight: string;
  weight_unit: 'oz' | 'g' | 'lbs' | 'kg';
  notes?: string;
  photo?: File | null;
}

interface LitterData {
  id: string;
  litter_name?: string;
  birth_date: string;
  dam?: { name: string; id: string; };
  sire?: { name: string; id: string; };
}

const WhelpingLiveSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('puppies');
  const [isAddPuppyOpen, setIsAddPuppyOpen] = useState(false);
  const [isAddShiftLogOpen, setIsAddShiftLogOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Form data
  const [puppyForm, setPuppyForm] = useState<PuppyFormData>({
    gender: 'Male',
    color: '',
    birth_weight: '',
    weight_unit: 'oz',
    notes: '',
    photo: null
  });
  
  const [shiftLog, setShiftLog] = useState<Omit<ShiftLog, 'litter_id' | 'timestamp'>>({
    attended_by: '',
    notes: ''
  });
  
  const [isFinishSessionOpen, setIsFinishSessionOpen] = useState(false);

  // Fetch litter data
  const { data: litter, isLoading: litterLoading } = useQuery({
    queryKey: ['litter', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dogs!litters_dam_id_fkey(id, name),
          sire:dogs!litters_sire_id_fkey(id, name)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw new Error(error.message);
      return data as LitterData;
    },
    enabled: !!id
  });
  
  // Fetch puppies for this litter
  const { data: puppies = [], isLoading: puppiesLoading } = useQuery({
    queryKey: ['puppies', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .eq('litter_id', id)
        .order('birth_time', { ascending: true });
        
      if (error) throw new Error(error.message);
      return data as Puppy[];
    },
    enabled: !!id
  });
  
  // Fetch shift logs
  const { data: shiftLogs = [], isLoading: shiftLogsLoading } = useQuery({
    queryKey: ['shift-logs', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('whelping_shift_logs')
        .select('*')
        .eq('litter_id', id)
        .order('timestamp', { ascending: false });
        
      if (error) throw new Error(error.message);
      return data as ShiftLog[];
    },
    enabled: !!id
  });
  
  // Add puppy mutation
  const addPuppyMutation = useMutation({
    mutationFn: async (newPuppy: Omit<Puppy, 'id' | 'birth_time' | 'birth_order'>) => {
      // First upload the photo if present
      let photoUrl = undefined;
      if (puppyForm.photo) {
        try {
          // Resize image before upload to optimize storage
          const resizedImage = await resizeImage(puppyForm.photo);
          photoUrl = await uploadPhoto(resizedImage, 'puppy-photos', `litter-${id}`);
        } catch (error) {
          console.error('Error uploading photo:', error);
          toast.error('Failed to upload photo, but continuing with puppy record creation');
        }
      }
      
      // Create puppy record
      const birthTime = new Date().toISOString();
      const birth_order = puppies.length + 1;
      
      const { data, error } = await supabase
        .from('puppies')
        .insert({
          ...newPuppy,
          photo_url: photoUrl,
          birth_time: birthTime,
          birth_order
        })
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['puppies', id] });
      setIsAddPuppyOpen(false);
      resetPuppyForm();
      toast.success('Puppy recorded successfully!');
    },
    onError: (error) => {
      console.error('Error recording puppy:', error);
      toast.error('Failed to record puppy. Please try again.');
    }
  });
  
  // Add shift log mutation
  const addShiftLogMutation = useMutation({
    mutationFn: async (newLog: Omit<ShiftLog, 'id'>) => {
      const { data, error } = await supabase
        .from('whelping_shift_logs')
        .insert(newLog)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-logs', id] });
      setIsAddShiftLogOpen(false);
      setShiftLog({ attended_by: '', notes: '' });
      toast.success('Shift log recorded successfully!');
    },
    onError: (error) => {
      console.error('Error recording shift log:', error);
      toast.error('Failed to record shift log. Please try again.');
    }
  });
  
  // Finish session (will just navigate away for now)
  const finishSession = () => {
    toast.success('Whelping session completed!');
    navigate(`/litters/${id}`);
  };
  
  // Handle form submission for puppy
  const handleAddPuppy = () => {
    if (!id) return;
    if (!puppyForm.color || !puppyForm.birth_weight) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    addPuppyMutation.mutate({
      litter_id: id,
      gender: puppyForm.gender,
      color: puppyForm.color,
      birth_weight: puppyForm.birth_weight,
      weight_unit: puppyForm.weight_unit,
      notes: puppyForm.notes
    });
  };
  
  // Handle form submission for shift log
  const handleAddShiftLog = () => {
    if (!id || !shiftLog.attended_by) {
      toast.error('Please enter the name of the attendant');
      return;
    }
    
    addShiftLogMutation.mutate({
      litter_id: id,
      attended_by: shiftLog.attended_by,
      notes: shiftLog.notes,
      timestamp: new Date().toISOString()
    });
  };
  
  // Reset puppy form
  const resetPuppyForm = () => {
    setPuppyForm({
      gender: 'Male',
      color: '',
      birth_weight: '',
      weight_unit: 'oz',
      notes: '',
      photo: null
    });
    setPhotoPreview(null);
  };
  
  // Handle file input change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPuppyForm(prev => ({ ...prev, photo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Calculate time between puppies
  const getTimeBetweenPuppies = (index: number) => {
    if (index === 0 || !puppies[index - 1]) return null;
    
    const currentPupTime = new Date(puppies[index].birth_time);
    const prevPupTime = new Date(puppies[index - 1].birth_time);
    
    const minutes = differenceInMinutes(currentPupTime, prevPupTime);
    if (minutes < 60) {
      return `${minutes} mins after previous`;
    }
    
    const hours = differenceInHours(currentPupTime, prevPupTime);
    return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes % 60} mins after previous`;
  };
  
  if (litterLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading whelping session...</p>
        </div>
      </div>
    );
  }
  
  if (!litter) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold">Litter Not Found</h2>
          <p className="text-muted-foreground mt-2">Could not find the specified litter.</p>
          <Button className="mt-4" onClick={() => navigate('/litters')}>
            Go to Litters
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            Live Whelping Session
          </h1>
          <p className="text-muted-foreground">
            {litter.litter_name || 'Unnamed Litter'} - 
            {litter.birth_date && format(new Date(litter.birth_date), ' MMM d, yyyy')}
          </p>
          <div className="flex items-center mt-1 text-sm">
            <span className="font-medium">Dam:</span>
            <span className="ml-2">{litter.dam?.name || 'Unknown'}</span>
            {litter.sire && (
              <>
                <span className="font-medium ml-4">Sire:</span>
                <span className="ml-2">{litter.sire.name}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAddPuppyOpen(true)}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Record Puppy
          </Button>
          <Button 
            onClick={() => setIsAddShiftLogOpen(true)}
            variant="outline"
            className="gap-1"
          >
            <Clock className="h-4 w-4" />
            Add Shift Log
          </Button>
          <Button 
            onClick={() => setIsFinishSessionOpen(true)}
            variant="destructive"
            className="gap-1"
          >
            <XCircle className="h-4 w-4" />
            Finish
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="puppies">
            Puppies ({puppies.length})
          </TabsTrigger>
          <TabsTrigger value="shiftLogs">
            Shift Logs ({shiftLogs.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="puppies" className="space-y-4">
          {puppiesLoading ? (
            <div className="flex items-center justify-center p-8">
              <p>Loading puppies...</p>
            </div>
          ) : puppies.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground mb-4">No puppies recorded yet</p>
                <Button onClick={() => setIsAddPuppyOpen(true)}>
                  Record First Puppy
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {puppies.map((puppy, index) => (
                <Card key={puppy.id} className="overflow-hidden">
                  <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
                    {puppy.photo_url ? (
                      <img 
                        src={puppy.photo_url} 
                        alt={`Puppy #${puppy.birth_order}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground">No photo</div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Puppy #{puppy.birth_order}</CardTitle>
                      <span className="text-sm font-medium bg-primary/10 px-2 py-1 rounded-md">
                        {puppy.gender}
                      </span>
                    </div>
                    <CardDescription>
                      {format(new Date(puppy.birth_time), 'h:mm a')} - {
                        formatDistanceToNow(new Date(puppy.birth_time), { addSuffix: true })
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Color:</span>
                        <span>{puppy.color}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Weight:</span>
                        <span>{puppy.birth_weight} {puppy.weight_unit}</span>
                      </div>
                      {index > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Time since previous:</span>
                          <span>{getTimeBetweenPuppies(index)}</span>
                        </div>
                      )}
                      {puppy.notes && (
                        <div className="mt-2 pt-2 border-t text-sm">
                          <p className="text-muted-foreground mb-1">Notes:</p>
                          <p>{puppy.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="shiftLogs" className="space-y-4">
          {shiftLogsLoading ? (
            <div className="flex items-center justify-center p-8">
              <p>Loading shift logs...</p>
            </div>
          ) : shiftLogs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground mb-4">No shift logs recorded yet</p>
                <Button onClick={() => setIsAddShiftLogOpen(true)}>
                  Add First Shift Log
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {shiftLogs.map((log) => (
                <Card key={log.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{log.attended_by}</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(log.timestamp), 'MMM d, yyyy - h:mm a')}
                      </span>
                    </div>
                  </CardHeader>
                  {log.notes && (
                    <CardContent>
                      <p>{log.notes}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add Puppy Dialog */}
      <Dialog open={isAddPuppyOpen} onOpenChange={setIsAddPuppyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record New Puppy</DialogTitle>
            <DialogDescription>
              Puppy #{puppies.length + 1} - {format(new Date(), 'h:mm a')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Gender
              </Label>
              <Select
                value={puppyForm.gender}
                onValueChange={(value: 'Male' | 'Female') => 
                  setPuppyForm(prev => ({ ...prev, gender: value }))
                }
              >
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
                Color/Markings
              </Label>
              <Input
                id="color"
                className="col-span-3"
                value={puppyForm.color}
                onChange={(e) => setPuppyForm(prev => ({ ...prev, color: e.target.value }))}
                placeholder="e.g., Black with white chest"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Birth Weight
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="weight"
                  type="text"
                  className="flex-1"
                  value={puppyForm.birth_weight}
                  onChange={(e) => setPuppyForm(prev => ({ ...prev, birth_weight: e.target.value }))}
                  placeholder="Weight"
                />
                <Select
                  value={puppyForm.weight_unit}
                  onValueChange={(value: 'oz' | 'g' | 'lbs' | 'kg') => 
                    setPuppyForm(prev => ({ ...prev, weight_unit: value }))
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">
                Notes
              </Label>
              <Textarea
                id="notes"
                className="col-span-3"
                value={puppyForm.notes}
                onChange={(e) => setPuppyForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any notes about the puppy or birth"
                rows={3}
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="photo" className="text-right pt-2">
                Photo
              </Label>
              <div className="col-span-3 space-y-2">
                {photoPreview ? (
                  <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setPuppyForm(prev => ({ ...prev, photo: null }));
                        setPhotoPreview(null);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label 
                      htmlFor="puppy-photo" 
                      className="flex flex-col items-center justify-center w-full h-32 bg-muted hover:bg-muted/80 rounded-md cursor-pointer border-2 border-dashed border-muted-foreground/25"
                    >
                      <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to add a photo</span>
                      <input
                        id="puppy-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPuppyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPuppy} disabled={addPuppyMutation.isPending}>
              {addPuppyMutation.isPending ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Puppy
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Shift Log Dialog */}
      <Dialog open={isAddShiftLogOpen} onOpenChange={setIsAddShiftLogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Shift Change</DialogTitle>
            <DialogDescription>
              Log who is attending the whelping session
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attended_by" className="text-right">
                Attended By
              </Label>
              <Input
                id="attended_by"
                className="col-span-3"
                value={shiftLog.attended_by}
                onChange={(e) => setShiftLog(prev => ({ ...prev, attended_by: e.target.value }))}
                placeholder="Enter name of caretaker"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="shift_notes" className="text-right pt-2">
                Notes
              </Label>
              <Textarea
                id="shift_notes"
                className="col-span-3"
                value={shiftLog.notes}
                onChange={(e) => setShiftLog(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any notes about this shift"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddShiftLogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddShiftLog} disabled={addShiftLogMutation.isPending}>
              {addShiftLogMutation.isPending ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Log
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Finish Session Dialog */}
      <Dialog open={isFinishSessionOpen} onOpenChange={setIsFinishSessionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finish Whelping Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to finish the whelping session?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p>You have recorded {puppies.length} puppies.</p>
            <p className="mt-2">This will take you back to the litter details page.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFinishSessionOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={finishSession}
            >
              Finish Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhelpingLiveSession;
