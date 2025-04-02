
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from '@/components/ui/separator';
import { AlertCircle, RefreshCw, Check, Clock, Scale, Utensils, Clipboard, Plus } from 'lucide-react';
import { formatDistance, format, isSameDay } from 'date-fns';
import { Litter, Puppy } from '@/types/litter';
import PuppyRegistrationForm from '../registration/PuppyRegistrationForm';
import PuppyCareLog from '../care/PuppyCareLog';

interface WelpingDashboardProps {
  litterId?: string;
}

interface ActiveLitter extends Litter {
  puppies: Puppy[];
  dam_name?: string;
  sire_name?: string;
}

interface CareTask {
  id: string;
  puppy_id: string;
  puppy_name: string;
  task_type: string;
  due_time: string;
  title: string;
  is_overdue: boolean;
}

interface PuppyCareInfo {
  puppyId: string;
  puppyName: string;
  lastCareTime?: string;
  lastWeightTime?: string;
  lastFeedingTime?: string;
  weight?: string;
  weightUnit?: string;
  ageInDays: number;
}

const WelpingDashboard: React.FC<WelpingDashboardProps> = ({ litterId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeLitter, setActiveLitter] = useState<ActiveLitter | null>(null);
  const [careTasks, setCareTasks] = useState<CareTask[]>([]);
  const [puppiesCare, setPuppiesCare] = useState<PuppyCareInfo[]>([]);
  const [selectedPuppyId, setSelectedPuppyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Load data
  useEffect(() => {
    fetchData();
  }, [litterId]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Get active litter (either specified or most recent in-progress whelping)
      let litterQuery = supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(id, name),
          sire:sire_id(id, name),
          puppies!litter_id(*)
        `)
        .order('birth_date', { ascending: false })
        .limit(1);
      
      if (litterId) {
        litterQuery = litterQuery.eq('id', litterId);
      } else {
        // Get most recent litter with active welping
        const { data: welpingData } = await supabase
          .from('welping_records')
          .select('*')
          .eq('status', 'in-progress')
          .order('birth_date', { ascending: false })
          .limit(1);
        
        if (welpingData && welpingData.length > 0) {
          litterQuery = litterQuery.eq('id', welpingData[0].litter_id);
        }
      }
      
      const { data: litterData, error: litterError } = await litterQuery;
      
      if (litterError) throw litterError;
      
      if (!litterData || litterData.length === 0) {
        setLoading(false);
        return;
      }
      
      // Format active litter
      const litter: ActiveLitter = {
        ...litterData[0],
        puppies: litterData[0].puppies || [],
        dam_name: litterData[0].dam?.name,
        sire_name: litterData[0].sire?.name
      };
      
      // Get puppy care info for each puppy
      const puppyIds = litter.puppies.map(p => p.id);
      
      if (puppyIds.length > 0) {
        // Get latest weight for each puppy
        const { data: weightData } = await supabase
          .from('weight_records')
          .select('*')
          .in('puppy_id', puppyIds)
          .order('date', { ascending: false });
        
        // Get latest feeding records
        const { data: feedingData } = await supabase
          .from('feeding_records')
          .select('*')
          .in('puppy_id', puppyIds)
          .order('timestamp', { ascending: false });
        
        // Get latest care logs
        const { data: careLogData } = await supabase
          .from('puppy_care_logs')
          .select('*')
          .in('puppy_id', puppyIds)
          .order('timestamp', { ascending: false });
        
        // Get upcoming tasks
        const { data: milestoneData } = await supabase
          .from('puppy_milestones')
          .select('*')
          .in('puppy_id', puppyIds)
          .gte('milestone_date', new Date().toISOString())
          .order('milestone_date', { ascending: true });
        
        // Organize data by puppy
        const careInfo: PuppyCareInfo[] = litter.puppies.map(puppy => {
          // Get latest weight
          const latestWeight = weightData?.find(w => w.puppy_id === puppy.id);
          
          // Get latest feeding
          const latestFeeding = feedingData?.find(f => f.puppy_id === puppy.id);
          
          // Get latest care log
          const latestCare = careLogData?.find(c => c.puppy_id === puppy.id);
          
          // Calculate age in days
          const birthDate = new Date(puppy.birth_date || litter.birth_date);
          const now = new Date();
          const ageInDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            puppyId: puppy.id,
            puppyName: puppy.name || `Puppy ${puppy.birth_order || ''}`,
            lastCareTime: latestCare?.timestamp,
            lastWeightTime: latestWeight?.date,
            lastFeedingTime: latestFeeding?.timestamp,
            weight: latestWeight?.weight?.toString(),
            weightUnit: latestWeight?.weight_unit,
            ageInDays
          };
        });
        
        // Create task list
        const tasks: CareTask[] = [];
        
        // Add scheduled milestones
        if (milestoneData) {
          milestoneData.forEach(milestone => {
            const puppy = litter.puppies.find(p => p.id === milestone.puppy_id);
            if (!puppy) return;
            
            const due = new Date(milestone.milestone_date);
            const isOverdue = due < new Date();
            
            tasks.push({
              id: milestone.id,
              puppy_id: milestone.puppy_id,
              puppy_name: puppy.name || `Puppy ${puppy.birth_order || ''}`,
              task_type: milestone.milestone_type || 'task',
              due_time: milestone.milestone_date,
              title: milestone.title || milestone.milestone_type || 'Task',
              is_overdue: isOverdue
            });
          });
        }
        
        // Add feeding reminders for puppies not fed in last 4 hours
        careInfo.forEach(puppy => {
          if (!puppy.lastFeedingTime || new Date(puppy.lastFeedingTime).getTime() < Date.now() - 4 * 60 * 60 * 1000) {
            tasks.push({
              id: `feed-${puppy.puppyId}`,
              puppy_id: puppy.puppyId,
              puppy_name: puppy.puppyName,
              task_type: 'feeding',
              due_time: new Date().toISOString(),
              title: `Feed ${puppy.puppyName}`,
              is_overdue: true
            });
          }
        });
        
        // Add weight check reminders for puppies not weighed today
        careInfo.forEach(puppy => {
          if (!puppy.lastWeightTime || !isSameDay(new Date(puppy.lastWeightTime), new Date())) {
            tasks.push({
              id: `weigh-${puppy.puppyId}`,
              puppy_id: puppy.puppyId,
              puppy_name: puppy.puppyName,
              task_type: 'weight',
              due_time: new Date().toISOString(),
              title: `Weigh ${puppy.puppyName}`,
              is_overdue: true
            });
          }
        });
        
        // Sort tasks by due time
        tasks.sort((a, b) => {
          if (a.is_overdue && !b.is_overdue) return -1;
          if (!a.is_overdue && b.is_overdue) return 1;
          return new Date(a.due_time).getTime() - new Date(b.due_time).getTime();
        });
        
        setCareTasks(tasks);
        setPuppiesCare(careInfo);
        
        // Set the selected puppy to the first one if none selected
        if (!selectedPuppyId && litter.puppies.length > 0) {
          setSelectedPuppyId(litter.puppies[0].id);
        }
      }
      
      setActiveLitter(litter);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load whelping dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePuppySelect = (puppyId: string) => {
    setSelectedPuppyId(puppyId);
    setActiveTab('care');
  };
  
  const handleCareTaskComplete = async (taskId: string, taskType: string, puppyId: string) => {
    // This would mark the task as complete
    // For demo purposes, just remove it from the list
    setCareTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    
    // If it's a standard task type, open the appropriate form
    if (taskType === 'feeding' || taskType === 'weight') {
      setSelectedPuppyId(puppyId);
      setActiveTab('care');
    }
  };
  
  const getSelectedPuppyInfo = () => {
    if (!selectedPuppyId || !activeLitter) return null;
    
    const puppy = activeLitter.puppies.find(p => p.id === selectedPuppyId);
    if (!puppy) return null;
    
    const careInfo = puppiesCare.find(p => p.puppyId === selectedPuppyId);
    
    return {
      name: puppy.name || `Puppy ${puppy.birth_order || ''}`,
      gender: puppy.gender || 'Unknown',
      color: puppy.color || 'Unknown',
      age_days: careInfo?.ageInDays || 0
    };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Whelping Dashboard</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData()}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      ) : !activeLitter ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center h-64">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No active litter found.</p>
              <p className="text-muted-foreground">Create a litter first or start a whelping record.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{activeLitter.litter_name || `Litter of ${activeLitter.dam_name || 'Unknown Dam'}`}</CardTitle>
              <CardDescription>
                {activeLitter.dam_name && `Dam: ${activeLitter.dam_name}`}
                {activeLitter.sire_name && ` • Sire: ${activeLitter.sire_name}`}
                {` • Birth Date: ${format(new Date(activeLitter.birth_date), 'MMM d, yyyy')}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{activeLitter.puppies.length}</p>
                  <p className="text-sm text-muted-foreground">Total Puppies</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {activeLitter.puppies.filter(p => p.gender === 'Male').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Males</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {activeLitter.puppies.filter(p => p.gender === 'Female').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Females</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Puppies list */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Puppies</h3>
                  {activeLitter.puppies.length === 0 ? (
                    <div className="p-4 border rounded text-center text-muted-foreground">
                      No puppies recorded yet. Add the first puppy using the "Register Puppy" tab.
                    </div>
                  ) : (
                    <ScrollArea className="h-[280px]">
                      <div className="space-y-2">
                        {activeLitter.puppies.map((puppy) => {
                          const careInfo = puppiesCare.find(p => p.puppyId === puppy.id);
                          return (
                            <div 
                              key={puppy.id}
                              className={`p-3 border rounded cursor-pointer flex justify-between items-center hover:bg-accent transition-colors ${selectedPuppyId === puppy.id ? 'border-primary bg-accent/50' : ''}`}
                              onClick={() => handlePuppySelect(puppy.id)}
                            >
                              <div>
                                <p className="font-medium">{puppy.name || `Puppy ${puppy.birth_order || ''}`}</p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <span>{puppy.gender || 'Unknown'}</span>
                                  <span className="mx-1">•</span>
                                  <span>{puppy.color || 'Unknown'}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                {careInfo?.weight && (
                                  <div className="font-medium">
                                    {careInfo.weight} {careInfo.weightUnit || 'oz'}
                                  </div>
                                )}
                                <div className="text-xs text-muted-foreground">
                                  {careInfo?.lastCareTime ? (
                                    <span>Last care: {formatDistance(new Date(careInfo.lastCareTime), new Date(), { addSuffix: true })}</span>
                                  ) : (
                                    <span>No care logs</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  )}
                </div>
                
                {/* Care tasks list */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Open Tasks</h3>
                  <ScrollArea className="h-[280px]">
                    {careTasks.length === 0 ? (
                      <div className="p-4 border rounded text-center text-muted-foreground">
                        No pending tasks. All puppies are up to date on care!
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {careTasks.map((task) => (
                          <div 
                            key={task.id}
                            className={`p-3 border rounded flex justify-between items-center ${task.is_overdue ? 'border-destructive/50 bg-destructive/10' : ''}`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center">
                                {task.task_type === 'feeding' && <Utensils className="h-4 w-4 mr-2" />}
                                {task.task_type === 'weight' && <Scale className="h-4 w-4 mr-2" />}
                                {task.task_type !== 'feeding' && task.task_type !== 'weight' && (
                                  <Clipboard className="h-4 w-4 mr-2" />
                                )}
                                <p className="font-medium">{task.title}</p>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span>{task.puppy_name}</span>
                                <span className="mx-1">•</span>
                                <span>
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {task.is_overdue ? 'Overdue' : 
                                    formatDistance(new Date(task.due_time), new Date(), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCareTaskComplete(task.id, task.task_type, task.puppy_id)}
                              title="Mark as complete"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="register">Register Puppy</TabsTrigger>
              <TabsTrigger value="care">Care Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Whelping Dashboard Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Select a puppy from the list above to view details and add care logs.</p>
                  <p className="text-muted-foreground mt-2">Use the "Register Puppy" tab to add new puppies to the litter.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <PuppyRegistrationForm 
                litterId={activeLitter.id}
                litterInfo={{
                  litterName: activeLitter.litter_name,
                  damName: activeLitter.dam_name,
                  sireName: activeLitter.sire_name,
                  birthDate: activeLitter.birth_date
                }}
                onSuccess={fetchData}
              />
            </TabsContent>
            
            <TabsContent value="care">
              {selectedPuppyId ? (
                <PuppyCareLog 
                  puppyId={selectedPuppyId}
                  puppyInfo={getSelectedPuppyInfo()}
                  onSuccess={fetchData}
                  onRefresh={fetchData}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-6">
                      <p>Select a puppy from the list to add care logs.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default WelpingDashboard;
