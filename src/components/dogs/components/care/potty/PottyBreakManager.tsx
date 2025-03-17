
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDailyCare } from '@/contexts/dailyCare';
import { DogCareStatus } from '@/types/dailyCare';
import { Clock, Users, AlertTriangle, RefreshCw, Plus, Check } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { DialogContent, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { getRecentPottyBreakSessions, PottyBreakSession, createPottyBreakSession } from '@/services/dailyCare/pottyBreakService';
import PottyBreakGroupSelector from './PottyBreakGroupSelector';
import PottyBreakHistoryList from './PottyBreakHistoryList';
import PottyBreakDogSelection from './PottyBreakDogSelection';

interface PottyBreakManagerProps {
  dogs: DogCareStatus[];
  onRefresh: () => void;
}

const PottyBreakManager: React.FC<PottyBreakManagerProps> = ({ dogs, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('quick');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [recentSessions, setRecentSessions] = useState<PottyBreakSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const { loading } = useDailyCare();

  // Fetch recent potty break sessions
  useEffect(() => {
    const fetchRecentSessions = async () => {
      try {
        setIsLoading(true);
        const sessions = await getRecentPottyBreakSessions(5);
        setRecentSessions(sessions);
      } catch (error) {
        console.error('Error fetching recent potty break sessions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recent potty breaks.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentSessions();
  }, [toast, refreshTrigger]);

  // Handler for quick potty break logging
  const handleQuickPottyBreak = async (dogId: string, dogName: string) => {
    try {
      setIsLoading(true);
      await createPottyBreakSession({ dogs: [dogId] });
      toast({
        title: 'Potty Break Logged',
        description: `${dogName} was taken out for a potty break.`,
      });
      setRefreshTrigger(prev => prev + 1);
      onRefresh();
    } catch (error) {
      console.error('Error logging quick potty break:', error);
      toast({
        title: 'Error',
        description: 'Failed to log potty break.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for group potty break logging
  const handleGroupPottyBreak = async () => {
    if (selectedDogs.length === 0) {
      toast({
        title: 'No dogs selected',
        description: 'Please select at least one dog for the potty break.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await createPottyBreakSession({ dogs: selectedDogs });
      toast({
        title: 'Group Potty Break Logged',
        description: `${selectedDogs.length} dogs were taken out for a potty break.`,
      });
      setDialogOpen(false);
      setSelectedDogs([]);
      setRefreshTrigger(prev => prev + 1);
      onRefresh();
    } catch (error) {
      console.error('Error logging group potty break:', error);
      toast({
        title: 'Error',
        description: 'Failed to log group potty break.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get times since last potty break
  const getTimeSinceLastPottyBreak = (dog: DogCareStatus) => {
    if (!dog.last_care || dog.last_care.category !== 'pottybreaks') {
      return 'Never';
    }
    
    return formatDistanceToNow(parseISO(dog.last_care.timestamp), { addSuffix: true });
  };

  // Sort dogs by potty break status (those needing potty breaks first)
  const sortedDogs = [...dogs].sort((a, b) => {
    if (!a.last_care && !b.last_care) return 0;
    if (!a.last_care) return -1;
    if (!b.last_care) return 1;
    
    // Sort by last potty break time (oldest first)
    if (a.last_care.category === 'pottybreaks' && b.last_care.category === 'pottybreaks') {
      return new Date(a.last_care.timestamp) < new Date(b.last_care.timestamp) ? -1 : 1;
    }
    
    // Put those with potty breaks after those without
    if (a.last_care.category === 'pottybreaks') return 1;
    if (b.last_care.category === 'pottybreaks') return -1;
    
    return 0;
  });

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <Users className="h-5 w-5 mr-2" />
          Dog Potty Break Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="quick">Quick Potty Break</TabsTrigger>
            <TabsTrigger value="group">Group Potty Break</TabsTrigger>
            <TabsTrigger value="history">Recent History</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedDogs.map(dog => {
                const needsPottyBreak = !dog.last_care || dog.last_care.category !== 'pottybreaks';
                return (
                  <Card 
                    key={`quick-${dog.dog_id}`} 
                    className={`shadow-sm border overflow-hidden hover:shadow-md transition ${
                      needsPottyBreak ? 'border-amber-400 dark:border-amber-700' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <CardContent className="p-4 flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {dog.dog_photo ? (
                          <img 
                            src={dog.dog_photo} 
                            alt={dog.dog_name} 
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <span>{dog.dog_name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{dog.dog_name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {getTimeSinceLastPottyBreak(dog)}
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        variant={needsPottyBreak ? "default" : "outline"}
                        onClick={() => handleQuickPottyBreak(dog.dog_id, dog.dog_name)}
                        disabled={isLoading}
                      >
                        {needsPottyBreak ? 'Log Break' : 'Update'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="group">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Group Potty Break</h3>
              <Button 
                onClick={() => setDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Group Break
              </Button>
            </div>

            <PottyBreakGroupSelector 
              dogs={dogs}
              onGroupSelected={(dogIds) => {
                setSelectedDogs(dogIds);
                setDialogOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="history">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Recent Potty Breaks</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            <PottyBreakHistoryList 
              sessions={recentSessions}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Select dogs for potty break</DialogTitle>
            </DialogHeader>
            
            <PottyBreakDogSelection
              dogs={dogs}
              selectedDogs={selectedDogs}
              onChange={setSelectedDogs}
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGroupPottyBreak}
                disabled={selectedDogs.length === 0 || isLoading}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                {isLoading ? 'Logging...' : 'Log Potty Break'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PottyBreakManager;
