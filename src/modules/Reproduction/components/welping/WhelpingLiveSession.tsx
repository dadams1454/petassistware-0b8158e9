
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { format, formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Clock, Save, CheckCircle, PlusCircle, ArrowLeft, Users, AlertCircle } from 'lucide-react';
import { Litter } from '@/types/litter';
import { useToast } from '@/components/ui/use-toast';

interface PuppyForm {
  sex: 'Male' | 'Female';
  color: string;
  weight: string;
  weight_unit: 'g' | 'oz' | 'lb'; 
  notes: string;
  photo?: File;
}

interface PuppyRecord {
  id?: string;
  litter_id: string;
  name?: string;
  gender: 'Male' | 'Female';
  color: string;
  birth_weight: string;
  weight_unit: 'g' | 'oz' | 'lb';
  birth_time: string;
  birth_order: number;
  photo_url?: string;
  notes?: string;
}

interface ShiftLog {
  id?: string;
  litter_id: string;
  attended_by: string;
  notes: string;
  timestamp: string;
}

const WhelpingLiveSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [litter, setLitter] = useState<Litter | null>(null);
  const [puppies, setPuppies] = useState<PuppyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('logging');
  const [shiftLogs, setShiftLogs] = useState<ShiftLog[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { handleSubmit, reset, control, formState: { errors } } = useForm<PuppyForm>({
    defaultValues: {
      sex: 'Male',
      color: '',
      weight: '',
      weight_unit: 'g',
      notes: ''
    }
  });
  
  const { handleSubmit: handleShiftSubmit, reset: resetShiftForm, control: shiftControl } = useForm<{
    attended_by: string;
    notes: string;
  }>({
    defaultValues: {
      attended_by: '',
      notes: ''
    }
  });

  // Fetch litter details and existing puppies
  useEffect(() => {
    const fetchLitterData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch litter details
        const { data: litterData, error: litterError } = await supabase
          .from('litters')
          .select(`
            *,
            dam:dogs!litters_dam_id_fkey(id, name, breed, photo_url),
            sire:dogs!litters_sire_id_fkey(id, name, breed, photo_url)
          `)
          .eq('id', id)
          .single();
        
        if (litterError) throw litterError;
        
        setLitter(litterData);
        
        // Fetch puppies for this litter
        const { data: puppiesData, error: puppiesError } = await supabase
          .from('puppies')
          .select('*')
          .eq('litter_id', id)
          .order('birth_order', { ascending: true });
        
        if (puppiesError) throw puppiesError;
        
        setPuppies(puppiesData || []);
        
        // Fetch shift logs
        const { data: logsData, error: logsError } = await supabase
          .from('whelping_shift_logs')
          .select('*')
          .eq('litter_id', id)
          .order('timestamp', { ascending: false });
        
        if (logsError) throw logsError;
        
        setShiftLogs(logsData || []);
        
      } catch (error) {
        console.error('Error fetching litter data:', error);
        toast({
          title: "Error",
          description: "Failed to load whelping session data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLitterData();
  }, [id, toast]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File, puppyId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}/${puppyId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('puppy-photos')
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('puppy-photos')
        .getPublicUrl(fileName);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  // Submit new puppy
  const onSubmitPuppy = async (data: PuppyForm) => {
    if (!id || !litter) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare puppy data
      const birthTime = new Date().toISOString();
      const puppyOrder = puppies.length + 1;
      
      const puppyData: PuppyRecord = {
        litter_id: id,
        gender: data.sex,
        color: data.color,
        birth_weight: data.weight,
        weight_unit: data.weight_unit,
        birth_time: birthTime,
        birth_order: puppyOrder,
        notes: data.notes,
        name: `${litter.dam?.name}'s Puppy #${puppyOrder}`
      };
      
      // Insert puppy record
      const { data: newPuppy, error } = await supabase
        .from('puppies')
        .insert(puppyData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Upload image if available
      if (uploadedImage && newPuppy) {
        const photoUrl = await uploadImage(uploadedImage, newPuppy.id);
        
        if (photoUrl) {
          // Update puppy with photo URL
          await supabase
            .from('puppies')
            .update({ photo_url: photoUrl })
            .eq('id', newPuppy.id);
          
          newPuppy.photo_url = photoUrl;
        }
      }
      
      // Update puppies state with new record
      setPuppies([...puppies, newPuppy]);
      
      // Reset form
      reset();
      setUploadedImage(null);
      setImagePreview(null);
      
      toast({
        title: "Success",
        description: `Puppy #${puppyOrder} logged successfully`,
      });
      
    } catch (error) {
      console.error('Error submitting puppy:', error);
      toast({
        title: "Error",
        description: "Failed to log puppy",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit shift log
  const onSubmitShiftLog = async (data: { attended_by: string; notes: string; }) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      
      const logData: ShiftLog = {
        litter_id: id,
        attended_by: data.attended_by,
        notes: data.notes,
        timestamp: new Date().toISOString()
      };
      
      const { data: newLog, error } = await supabase
        .from('whelping_shift_logs')
        .insert(logData)
        .select()
        .single();
      
      if (error) throw error;
      
      setShiftLogs([newLog, ...shiftLogs]);
      resetShiftForm();
      
      toast({
        title: "Success",
        description: "Caretaker shift log recorded",
      });
      
    } catch (error) {
      console.error('Error submitting shift log:', error);
      toast({
        title: "Error",
        description: "Failed to record shift log",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete whelping session
  const finishWhelpingSession = async () => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      
      // Update litter status
      await supabase
        .from('litters')
        .update({ status: 'active', whelping_complete: true })
        .eq('id', id);
      
      toast({
        title: "Whelping Complete",
        description: "Whelping session has been completed successfully",
      });
      
      // Navigate to litter overview
      navigate(`/welping/${id}`);
      
    } catch (error) {
      console.error('Error completing whelping session:', error);
      toast({
        title: "Error",
        description: "Failed to complete whelping session",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading whelping session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!litter) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Litter not found. This whelping session may have been removed or doesn't exist.
          </AlertDescription>
        </Alert>
        <Button 
          variant="secondary" 
          className="mt-4"
          onClick={() => navigate('/welping')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Welping Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/welping')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Welping Dashboard
      </Button>
      
      <div className="bg-muted p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Live Whelping Session
              <Badge className="ml-2 bg-red-500">In Progress</Badge>
            </h1>
            <p className="text-muted-foreground mb-2">
              {litter.litter_name || `${litter.dam?.name}'s Litter`}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              <span>Started: {format(new Date(litter.birth_date), 'PPP p')}</span>
            </div>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button
              variant="outline"
              onClick={() => setActiveTab('shift')}
            >
              <Users className="mr-2 h-4 w-4" />
              Record Caretaker Shift
            </Button>
            <Button
              onClick={finishWhelpingSession}
              disabled={isSubmitting || puppies.length === 0}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Whelping
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="logging">Puppy Logging</TabsTrigger>
              <TabsTrigger value="shift">Caretaker Shifts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logging" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Log New Puppy
                    <Badge className="ml-2">#{puppies.length + 1}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmitPuppy)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sex">Sex</Label>
                        <Controller
                          name="sex"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.sex && <p className="text-red-500 text-sm mt-1">Sex is required</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="color">Color/Markings</Label>
                        <Controller
                          name="color"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Input {...field} placeholder="Black & White, Solid Brown, etc." />
                          )}
                        />
                        {errors.color && <p className="text-red-500 text-sm mt-1">Color is required</p>}
                      </div>
                      
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Label htmlFor="weight">Weight</Label>
                          <Controller
                            name="weight"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input {...field} type="number" step="0.01" placeholder="Weight" />
                            )}
                          />
                          {errors.weight && <p className="text-red-500 text-sm mt-1">Weight is required</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="weight_unit">Unit</Label>
                          <Controller
                            name="weight_unit"
                            control={control}
                            render={({ field }) => (
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-[80px]">
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="g">g</SelectItem>
                                  <SelectItem value="oz">oz</SelectItem>
                                  <SelectItem value="lb">lb</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="photo">Photo</Label>
                        <div className="mt-1 flex items-center">
                          <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Label 
                            htmlFor="photo" 
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Upload Photo
                          </Label>
                          
                          {imagePreview && (
                            <div className="ml-4 h-16 w-16 rounded-md overflow-hidden">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="h-full w-full object-cover" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Controller
                          name="notes"
                          control={control}
                          render={({ field }) => (
                            <Textarea 
                              {...field} 
                              placeholder="Any observations or special notes about this puppy..."
                              rows={3}
                            />
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        Log Puppy #{puppies.length + 1}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {/* Emergency information card */}
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-amber-800 text-base">Whelping Emergency Information</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-amber-700">
                  <p className="mb-2">
                    <strong>Veterinarian:</strong> Call Dr. Jenkins at (555) 123-4567
                  </p>
                  <p className="mb-2">
                    <strong>If puppy is not breathing:</strong> Clear airways and gently massage
                  </p>
                  <p>
                    <strong>If dam shows distress:</strong> Monitor temperature and call vet immediately
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shift" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Record Caretaker Shift
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShiftSubmit(onSubmitShiftLog)}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="attended_by">Attended By</Label>
                        <Controller
                          name="attended_by"
                          control={shiftControl}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Input {...field} placeholder="Caretaker name" />
                          )}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Controller
                          name="notes"
                          control={shiftControl}
                          render={({ field }) => (
                            <Textarea 
                              {...field} 
                              placeholder="Any special instructions or observations during this shift..."
                              rows={4}
                            />
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        Record Shift
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Previous Shifts</h3>
                {shiftLogs.length === 0 ? (
                  <p className="text-muted-foreground">No shift logs recorded yet.</p>
                ) : (
                  shiftLogs.map((log) => (
                    <Card key={log.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{log.attended_by}</h4>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(log.timestamp), 'PPP p')}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                          </Badge>
                        </div>
                        {log.notes && (
                          <p className="mt-2 text-sm">{log.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Whelping Timeline
                <Badge className="ml-2">{puppies.length} Puppies</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              {puppies.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  <p>No puppies logged yet.</p>
                  <p className="text-sm mt-2">Start logging puppies as they are born.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {puppies.map((puppy, index) => {
                    const prevPuppyTime = index > 0 ? new Date(puppies[index - 1].birth_time) : null;
                    const currentPuppyTime = new Date(puppy.birth_time);
                    const timeSincePrevious = prevPuppyTime 
                      ? Math.round((currentPuppyTime.getTime() - prevPuppyTime.getTime()) / (1000 * 60))
                      : null;
                    
                    return (
                      <div key={puppy.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge 
                              className={puppy.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}
                            >
                              {puppy.gender}
                            </Badge>
                            <span className="ml-2 font-medium">
                              Puppy #{puppy.birth_order}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(puppy.birth_time), 'h:mm a')}
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          {puppy.photo_url ? (
                            <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={puppy.photo_url}
                                alt={`Puppy #${puppy.birth_order}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-muted-foreground">No photo</span>
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Color:</span>{' '}
                                {puppy.color}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Weight:</span>{' '}
                                {puppy.birth_weight} {puppy.weight_unit}
                              </div>
                              {timeSincePrevious !== null && (
                                <div className="col-span-2">
                                  <span className="text-muted-foreground">Time since previous:</span>{' '}
                                  {timeSincePrevious} minutes
                                </div>
                              )}
                              {puppy.notes && (
                                <div className="col-span-2 mt-1">
                                  <span className="text-muted-foreground">Notes:</span>{' '}
                                  {puppy.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
              <div>Dam: {litter.dam?.name || 'Unknown'}</div>
              <div>Sire: {litter.sire?.name || 'Unknown'}</div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhelpingLiveSession;
