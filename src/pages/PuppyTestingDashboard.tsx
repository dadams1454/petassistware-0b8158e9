import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Milk, Droplet, Weight, Stethoscope, ArrowLeft, TextCursor } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import PuppyCareLog from '@/components/puppies/dashboard/PuppyCareLog';
import WeightTrackingGraph from '@/components/puppies/growth/WeightTrackingGraph';
import MilestoneTracker from '@/components/puppies/milestones/MilestoneTracker';
import { Switch } from '@/components/ui/switch';

const PuppyTestingDashboard = () => {
  const { litterId } = useParams<{ litterId: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [litter, setLitter] = useState<any>(null);
  const [puppies, setPuppies] = useState<any[]>([]);
  const [selectedPuppyId, setSelectedPuppyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('care');
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    if (litterId) {
      fetchLitterData();
    }
  }, [litterId]);

  const fetchLitterData = async () => {
    setIsLoading(true);
    try {
      // Fetch litter data
      const { data: litterData, error: litterError } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(id, name),
          sire:sire_id(id, name)
        `)
        .eq('id', litterId)
        .single();

      if (litterError) throw litterError;
      setLitter(litterData);

      // Fetch puppies in this litter
      const { data: puppiesData, error: puppiesError } = await supabase
        .from('puppies')
        .select('*')
        .eq('litter_id', litterId)
        .order('birth_order', { ascending: true });

      if (puppiesError) throw puppiesError;
      setPuppies(puppiesData || []);

      // Select the first puppy by default
      if (puppiesData && puppiesData.length > 0) {
        setSelectedPuppyId(puppiesData[0].id);
      }

      // Check if this is a test litter
      if (puppiesData && puppiesData.length > 0 && puppiesData[0].is_test_data) {
        setIsTestMode(true);
      }
    } catch (error) {
      console.error('Error fetching litter data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load litter data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLatestPuppyData = async (puppyId: string) => {
    try {
      // Fetch latest care log
      const { data: latestCare } = await supabase
        .from('puppy_care_logs')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      // Fetch latest weight
      const { data: latestWeight } = await supabase
        .from('weight_records')
        .select('*')
        .eq('puppy_id', puppyId)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      // Update puppy data in state
      setPuppies(puppies.map(puppy => 
        puppy.id === puppyId 
          ? { 
              ...puppy, 
              latest_care: latestCare, 
              latest_weight: latestWeight 
            }
          : puppy
      ));
    } catch (error) {
      console.error('Error fetching latest puppy data:', error);
    }
  };

  const getPuppyStatus = (puppy: any) => {
    // This is a simplified version - in a real app, you would have more complex logic
    const latestCare = puppy.latest_care;
    const latestWeight = puppy.latest_weight;
    
    if (!latestCare && !latestWeight) {
      return { status: 'warning', label: 'No Data' };
    }
    
    const now = new Date();
    let status = 'success';
    
    // Check if no weight record in last 24 hours
    if (latestWeight) {
      const weightDate = new Date(latestWeight.date);
      const hoursSinceWeight = (now.getTime() - weightDate.getTime()) / (1000 * 60 * 60);
      if (hoursSinceWeight > 24) {
        status = 'warning';
      }
    } else {
      status = 'warning';
    }
    
    // Check if no care log in last 4 hours
    if (latestCare) {
      const careDate = new Date(latestCare.timestamp);
      const hoursSinceCare = (now.getTime() - careDate.getTime()) / (1000 * 60 * 60);
      if (hoursSinceCare > 4) {
        status = status === 'warning' ? 'danger' : 'warning';
      }
    } else {
      status = 'warning';
    }
    
    return { 
      status, 
      label: status === 'success' ? 'Healthy' : status === 'warning' ? 'Monitor' : 'Attention Needed' 
    };
  };

  const handleCareLogAdded = () => {
    if (selectedPuppyId) {
      getLatestPuppyData(selectedPuppyId);
    }
    toast({
      title: 'Care Log Updated',
      description: 'The care log has been updated successfully',
    });
  };

  const handleMilestoneAdded = () => {
    toast({
      title: 'Milestone Added',
      description: 'The milestone has been added successfully',
    });
  };

  const handleQuickAction = async (puppyId: string, actionType: string) => {
    try {
      let careLog = {
        puppy_id: puppyId,
        care_type: '',
        timestamp: new Date().toISOString(),
        details: {},
        notes: `Quick ${actionType} entry`,
      };

      switch (actionType) {
        case 'feed':
          careLog.care_type = 'feeding';
          careLog.details = { type: 'formula', amount: '15', unit: 'ml' };
          break;
        case 'potty':
          careLog.care_type = 'potty';
          careLog.details = { type: 'both', successful: true };
          break;
        case 'weight':
          // For weight, we'll prompt for the value
          const weight = prompt('Enter current weight (oz):');
          if (!weight) return;
          
          careLog.care_type = 'weight';
          careLog.details = { weight, unit: 'oz' };
          
          // Also add to weight_records
          const weightRecord = {
            puppy_id: puppyId,
            weight: parseFloat(weight),
            weight_unit: 'oz',
            date: new Date().toISOString().split('T')[0],
            notes: 'Quick entry from dashboard',
          };
          
          await supabase.from('weight_records').insert(weightRecord);
          break;
        case 'health':
          const notes = prompt('Enter health observation:');
          if (!notes) return;
          
          careLog.care_type = 'health';
          careLog.details = { category: 'general' };
          careLog.notes = notes;
          break;
      }

      // Add care log
      await supabase.from('puppy_care_logs').insert(careLog);
      
      // Update data
      await getLatestPuppyData(puppyId);
      
      toast({
        title: 'Quick Action',
        description: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} recorded successfully`,
      });
    } catch (error) {
      console.error('Error performing quick action:', error);
      toast({
        title: 'Error',
        description: 'Failed to record action',
        variant: 'destructive',
      });
    }
  };

  const getSelectedPuppy = () => {
    return puppies.find(puppy => puppy.id === selectedPuppyId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to={`/litters/${litterId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              Puppy Care Testing
              {isTestMode && (
                <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-300">
                  TEST MODE
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              {litter?.litter_name || 'Unnamed Litter'} - {litter?.dam?.name || 'Dam'} x {litter?.sire?.name || 'Sire'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/litter/${litterId}/add-puppies`}>
            <Button className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" /> Add Puppies
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Puppies</CardTitle>
            </CardHeader>
            <CardContent>
              {puppies.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No puppies found in this litter
                </div>
              ) : (
                <div className="space-y-2">
                  {puppies.map(puppy => {
                    const status = getPuppyStatus(puppy);
                    return (
                      <div 
                        key={puppy.id} 
                        className={`border rounded-lg p-3 cursor-pointer ${
                          selectedPuppyId === puppy.id 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedPuppyId(puppy.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{puppy.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {puppy.gender}, {puppy.color}
                              {puppy.birth_order && ` - #${puppy.birth_order}`}
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${status.status === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 
                                status.status === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 
                                'bg-red-100 text-red-800 border-red-300'}
                            `}
                          >
                            {status.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-1 mt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAction(puppy.id, 'feed');
                            }}
                          >
                            <Milk className="h-3 w-3 mr-1" /> Feed
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-yellow-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAction(puppy.id, 'potty');
                            }}
                          >
                            <Droplet className="h-3 w-3 mr-1" /> Potty
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAction(puppy.id, 'weight');
                            }}
                          >
                            <Weight className="h-3 w-3 mr-1" /> Weigh
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-purple-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAction(puppy.id, 'health');
                            }}
                          >
                            <TextCursor className="h-3 w-3 mr-1" /> Note
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {getSelectedPuppy() && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Puppy Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{getSelectedPuppy().name}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Gender:</span>{' '}
                        <span className="font-medium">{getSelectedPuppy().gender}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Color:</span>{' '}
                        <span className="font-medium">{getSelectedPuppy().color}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Birth Weight:</span>{' '}
                        <span className="font-medium">
                          {getSelectedPuppy().birth_weight} {getSelectedPuppy().weight_unit || 'oz'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Current Weight:</span>{' '}
                        <span className="font-medium">
                          {getSelectedPuppy().latest_weight 
                            ? `${getSelectedPuppy().latest_weight.weight} ${getSelectedPuppy().latest_weight.weight_unit}`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Age:</span>{' '}
                        <span className="font-medium">
                          {litter?.birth_date 
                            ? `${differenceInDays(new Date(), new Date(litter.birth_date))} days`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Birth Order:</span>{' '}
                        <span className="font-medium">#{getSelectedPuppy().birth_order || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h4 className="font-medium">Last Activities</h4>
                    <div className="mt-2 space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last Feeding:</span>{' '}
                        <span className="font-medium">
                          {getSelectedPuppy().latest_care?.care_type === 'feeding'
                            ? format(new Date(getSelectedPuppy().latest_care.timestamp), 'h:mm a')
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last Potty:</span>{' '}
                        <span className="font-medium">
                          {getSelectedPuppy().latest_care?.care_type === 'potty'
                            ? format(new Date(getSelectedPuppy().latest_care.timestamp), 'h:mm a')
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last Weight Check:</span>{' '}
                        <span className="font-medium">
                          {getSelectedPuppy().latest_weight
                            ? format(new Date(getSelectedPuppy().latest_weight.date), 'MMM d, h:mm a')
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {getSelectedPuppy().notes && (
                    <div className="pt-2 border-t">
                      <h4 className="font-medium">Notes</h4>
                      <div className="mt-1 text-sm">
                        {getSelectedPuppy().notes}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-2">
          {selectedPuppyId ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="care">Care Logs</TabsTrigger>
                <TabsTrigger value="weight">Weight Tracking</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              </TabsList>
              <TabsContent value="care">
                <PuppyCareLog 
                  puppyId={selectedPuppyId} 
                  onSuccess={handleCareLogAdded} 
                />
              </TabsContent>
              <TabsContent value="weight">
                <WeightTrackingGraph 
                  puppyId={selectedPuppyId} 
                  puppyName={getSelectedPuppy()?.name || 'Puppy'}
                  birthDate={litter?.birth_date} 
                />
              </TabsContent>
              <TabsContent value="milestones">
                <MilestoneTracker 
                  puppyId={selectedPuppyId} 
                  birthDate={litter?.birth_date}
                  onMilestoneAdded={handleMilestoneAdded}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex justify-center items-center h-[300px]">
                <div className="text-center text-muted-foreground">
                  Select a puppy to view details
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuppyTestingDashboard;
