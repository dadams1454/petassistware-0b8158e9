import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { 
  Camera, 
  Clock, 
  Save, 
  CheckCircle, 
  XCircle,
  User,
  ArrowLeft,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { truncate } from '@/lib/utils';
import { Litter, Dog } from '@/types/litter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Interfaces for form data
interface PuppyFormData {
  gender: 'Male' | 'Female';
  color: string;
  birthWeight: string;
  weightUnit: 'lbs' | 'oz' | 'g' | 'kg';
  notes?: string;
  photoFile?: File;
}

interface ShiftLogFormData {
  attendedBy: string;
  notes?: string;
}

const WhelpingLiveSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [litter, setLitter] = useState<Litter | null>(null);
  const [puppies, setPuppies] = useState<any[]>([]);
  const [shiftLogs, setShiftLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('puppies');
  const [shiftLogDialogOpen, setShiftLogDialogOpen] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);

  // Form for puppy logging
  const puppyForm = useForm<PuppyFormData>({
    defaultValues: {
      gender: 'Male',
      color: '',
      birthWeight: '',
      weightUnit: 'oz',
      notes: '',
    }
  });

  // Form for shift logging
  const shiftLogForm = useForm<ShiftLogFormData>({
    defaultValues: {
      attendedBy: '',
      notes: '',
    }
  });

  // Fetch litter and puppy data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (!id) return;
      
      try {
        // Fetch litter data
        const { data: litterData, error: litterError } = await supabase
          .from('litters')
          .select(`
            *,
            dam:dam_id(*),
            sire:sire_id(*)
          `)
          .eq('id', id)
          .single();
        
        if (litterError) throw litterError;
        setLitter(litterData);
        
        // Fetch existing puppies
        await fetchPuppies();
        
        // Fetch shift logs
        await fetchShiftLogs();
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load whelping session data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const fetchPuppies = async () => {
    try {
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .eq('litter_id', id)
        .order('birth_time', { ascending: true });
      
      if (error) throw error;
      setPuppies(data || []);
    } catch (error) {
      console.error('Error fetching puppies:', error);
    }
  };

  const fetchShiftLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('whelping_shift_logs')
        .select('*')
        .eq('litter_id', id)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      setShiftLogs(data || []);
    } catch (error) {
      console.error('Error fetching shift logs:', error);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
    
    // Set the file in the form
    puppyForm.setValue('photoFile', file);
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${id}/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('puppy-photos')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('puppy-photos')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  };

  const onPuppySubmit = async (data: PuppyFormData) => {
    setSaving(true);
    
    try {
      let photoUrl = null;
      
      // Upload photo if provided
      if (data.photoFile) {
        photoUrl = await uploadPhoto(data.photoFile);
      }
      
      // Prepare puppy data
      const puppyData = {
        litter_id: id,
        gender: data.gender,
        color: data.color,
        birth_weight: data.birthWeight,
        weight_unit: data.weightUnit,
        notes: data.notes,
        photo_url: photoUrl,
        birth_order: puppies.length + 1,
        birth_time: new Date().toISOString(),
      };
      
      // Insert puppy record
      const { error } = await supabase
        .from('puppies')
        .insert(puppyData);
      
      if (error) throw error;
      
      // Reset form and preview
      puppyForm.reset({
        gender: 'Male',
        color: '',
        birthWeight: '',
        weightUnit: 'oz',
        notes: '',
      });
      setPhotoPreview(null);
      
      // Refresh puppy list
      await fetchPuppies();
      
      toast({
        title: 'Puppy recorded',
        description: 'The puppy has been successfully logged.',
      });
    } catch (error) {
      console.error('Error saving puppy:', error);
      toast({
        title: 'Error',
        description: 'Failed to save puppy data.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const onShiftLogSubmit = async (data: ShiftLogFormData) => {
    setSaving(true);
    
    try {
      const logData = {
        litter_id: id,
        attended_by: data.attendedBy,
        notes: data.notes,
        timestamp: new Date().toISOString(),
      };
      
      // Insert shift log
      const { error } = await supabase
        .from('whelping_shift_logs')
        .insert(logData);
      
      if (error) throw error;
      
      // Reset form and close dialog
      shiftLogForm.reset();
      setShiftLogDialogOpen(false);
      
      // Refresh shift logs
      await fetchShiftLogs();
      
      toast({
        title: 'Shift log recorded',
        description: 'The shift log has been successfully saved.',
      });
    } catch (error) {
      console.error('Error saving shift log:', error);
      toast({
        title: 'Error',
        description: 'Failed to save shift log.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFinishSession = async () => {
    try {
      // Update litter status if needed
      // This is optional as you might want to keep the litter active for other purposes
      await supabase
        .from('litters')
        .update({ status: 'active' })
        .eq('id', id);
      
      // Redirect to litter overview
      navigate(`/litters/${id}`);
      
      toast({
        title: 'Whelping session completed',
        description: 'The whelping session has been successfully completed.',
      });
    } catch (error) {
      console.error('Error finishing session:', error);
      toast({
        title: 'Error',
        description: 'Failed to finish whelping session.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-lg">Loading whelping session...</p>
        </div>
      </div>
    );
  }

  if (!litter) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Litter Not Found</h2>
          <p className="mb-4">The litter you're looking for doesn't exist or you don't have access.</p>
          <Button onClick={() => navigate('/welping')}>Back to Whelping</Button>
        </div>
      </div>
    );
  }

  const damName = litter.dam?.name || 'Unknown Dam';
  const sireName = litter.sire?.name || 'Unknown Sire';
  const litterName = litter.litter_name || `${damName}'s Litter`;
  const birthDate = litter.birth_date ? new Date(litter.birth_date) : new Date();

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/welping/${id}`)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{litterName}</h1>
            <p className="text-muted-foreground">
              {damName} × {sireName} • {format(birthDate, 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={shiftLogDialogOpen} onOpenChange={setShiftLogDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Log Caretaker
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Caretaker Shift</DialogTitle>
                <DialogDescription>
                  Record who is attending the whelping session.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...shiftLogForm}>
                <form onSubmit={shiftLogForm.handleSubmit(onShiftLogSubmit)} className="space-y-4">
                  <FormField
                    control={shiftLogForm.control}
                    name="attendedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attended By</FormLabel>
                        <FormControl>
                          <Input placeholder="Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={shiftLogForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any observations or notes for this shift"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShiftLogDialogOpen(false)}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Log'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={finishDialogOpen} onOpenChange={setFinishDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Finish Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Finish Whelping Session</DialogTitle>
                <DialogDescription>
                  Are you sure you want to end this whelping session? This will mark the whelping as completed.
                </DialogDescription>
              </DialogHeader>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setFinishDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default"
                  onClick={handleFinishSession}
                >
                  Yes, Finish Session
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Puppy entry form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Record New Puppy</CardTitle>
              <CardDescription>
                Enter details for puppy #{puppies.length + 1}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...puppyForm}>
                <form onSubmit={puppyForm.handleSubmit(onPuppySubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={puppyForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={puppyForm.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color/Markings</FormLabel>
                          <FormControl>
                            <Input placeholder="Color" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={puppyForm.control}
                      name="birthWeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Weight</FormLabel>
                          <FormControl>
                            <Input placeholder="Weight" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={puppyForm.control}
                      name="weightUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="oz">Ounces (oz)</SelectItem>
                              <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                              <SelectItem value="g">Grams (g)</SelectItem>
                              <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={puppyForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any observations or notes about this puppy"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>Photo</FormLabel>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 flex-shrink-0 rounded border">
                        {photoPreview ? (
                          <img 
                            src={photoPreview} 
                            alt="Puppy preview" 
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted rounded">
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <Input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                          {photoPreview ? 'Change Photo' : 'Upload Photo'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={saving || !puppyForm.formState.isValid}
                  >
                    {saving ? 'Recording...' : 'Record Puppy Birth'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Tabs with recorded puppies and caretaker logs */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Whelping Session</CardTitle>
                  <CardDescription>
                    {puppies.length > 0 
                      ? `${puppies.length} puppies recorded so far` 
                      : 'No puppies recorded yet'}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="flex gap-1 items-center">
                  <Clock className="h-3 w-3" />
                  Started {formatDistanceToNow(birthDate, { addSuffix: true })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="puppies">
                    Timeline ({puppies.length})
                  </TabsTrigger>
                  <TabsTrigger value="caretakers">
                    Caretaker Logs ({shiftLogs.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="puppies" className="space-y-4">
                  {puppies.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No puppies have been recorded yet. Use the form to record each birth.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {puppies.map((puppy, index) => {
                        const birthTime = new Date(puppy.birth_time);
                        const prevPuppy = index > 0 ? puppies[index - 1] : null;
                        const timeSincePrevious = prevPuppy 
                          ? differenceInMinutes(birthTime, new Date(prevPuppy.birth_time))
                          : null;
                          
                        return (
                          <Card key={puppy.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                              {/* Photo thumbnail */}
                              <div className="w-full sm:w-1/3 md:w-1/4 bg-muted flex-shrink-0">
                                {puppy.photo_url ? (
                                  <img 
                                    src={puppy.photo_url} 
                                    alt={`Puppy #${puppy.birth_order}`}
                                    className="w-full h-32 sm:h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-32 sm:h-full flex items-center justify-center">
                                    <Camera className="h-12 w-12 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Details */}
                              <div className="p-4 flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold text-lg">
                                    Puppy #{puppy.birth_order} 
                                    <span className="text-sm font-normal ml-2">
                                      ({puppy.gender})
                                    </span>
                                  </h3>
                                  <Badge variant={puppy.gender === 'Male' ? 'default' : 'secondary'}>
                                    {puppy.gender}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center text-sm text-muted-foreground gap-1 mb-2">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    Born at {format(birthTime, 'h:mm a')} on {format(birthTime, 'MMM d')}
                                  </span>
                                  {timeSincePrevious !== null && (
                                    <span className="ml-1 text-xs bg-muted px-1 rounded">
                                      {timeSincePrevious} min after previous
                                    </span>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                                  <div>
                                    <span className="text-muted-foreground">Color: </span>
                                    <span>{puppy.color}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Weight: </span>
                                    <span>
                                      {puppy.birth_weight} {puppy.weight_unit}
                                    </span>
                                  </div>
                                </div>
                                
                                {puppy.notes && (
                                  <div className="text-sm mt-2">
                                    <span className="text-muted-foreground">Notes: </span>
                                    <span>{truncate(puppy.notes, 100)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="caretakers" className="space-y-4">
                  {shiftLogs.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No caretaker logs recorded yet.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setShiftLogDialogOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Caretaker Log
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {shiftLogs.map((log) => (
                        <Card key={log.id}>
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">
                                {log.attended_by}
                              </CardTitle>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                              </span>
                            </div>
                          </CardHeader>
                          {log.notes && (
                            <CardContent className="py-2">
                              <p className="text-sm">{log.notes}</p>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                      
                      <div className="flex justify-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShiftLogDialogOpen(true)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Another Log
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhelpingLiveSession;
