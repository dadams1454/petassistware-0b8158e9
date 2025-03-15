
import React, { useEffect, useState } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { 
  Dog, 
  Clock, 
  PawPrint, 
  Heart, 
  Slash, 
  Flag,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CareLogForm from './CareLogForm';

interface CareDashboardProps {
  date?: Date;
}

const CareDashboard: React.FC<CareDashboardProps> = ({ date = new Date() }) => {
  const [dogsStatus, setDogsStatus] = useState<DogCareStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');
  const { toast } = useToast();

  // Flag mock data - in a real app, this would come from the database
  const dogFlags: Record<string, DogFlag[]> = {
    // These are example IDs, you'd need to replace with real dog IDs
    'some-dog-id-1': [{ type: 'in_heat' }],
    'some-dog-id-2': [{ type: 'incompatible', incompatible_with: ['some-dog-id-3'] }],
    'some-dog-id-3': [{ type: 'incompatible', incompatible_with: ['some-dog-id-2'] }],
    'some-dog-id-4': [{ type: 'special_attention', value: 'Medication needed' }],
  };

  const fetchDogsAndCareStatus = async () => {
    setLoading(true);
    try {
      // Fetch all dogs
      const { data: dogs, error: dogsError } = await supabase
        .from('dogs')
        .select('id, name, breed, color, photo_url')
        .order('name');

      if (dogsError) throw dogsError;

      // For each dog, fetch their most recent care log for today
      const statusPromises = dogs.map(async (dog) => {
        const todayStart = new Date(date);
        todayStart.setHours(0, 0, 0, 0);
        
        const { data: logs, error: logsError } = await supabase
          .from('daily_care_logs')
          .select('*')
          .eq('dog_id', dog.id)
          .gte('timestamp', todayStart.toISOString())
          .order('timestamp', { ascending: false })
          .limit(1);

        if (logsError) throw logsError;

        return {
          dog_id: dog.id,
          dog_name: dog.name,
          dog_photo: dog.photo_url,
          breed: dog.breed,
          color: dog.color,
          last_care: logs && logs.length > 0 ? {
            category: logs[0].category,
            task_name: logs[0].task_name,
            timestamp: logs[0].timestamp,
          } : null,
          flags: dogFlags[dog.id] || []
        } as DogCareStatus;
      });

      const statuses = await Promise.all(statusPromises);
      setDogsStatus(statuses);
    } catch (error) {
      console.error('Error fetching care status:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dogs care status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogsAndCareStatus();
  }, [date]);

  const handleCareLogSuccess = () => {
    setDialogOpen(false);
    fetchDogsAndCareStatus();
    toast({
      title: 'Success',
      description: 'Care log added successfully',
    });
  };

  const handleAddCareLog = (dogId: string) => {
    setSelectedDogId(dogId);
    setDialogOpen(true);
  };

  // Calculate completion percentage
  const careCompletionPercentage = Math.round(
    (dogsStatus.filter(dog => dog.last_care !== null).length / dogsStatus.length) * 100
  ) || 0;

  // Get dogs that need care (no logs today)
  const dogsNeedingCare = dogsStatus.filter(dog => dog.last_care === null);

  // Render dog flag icons
  const renderDogFlags = (flags: DogFlag[]) => {
    return flags.map((flag, index) => {
      let icon;
      let tooltipText;
      let color;

      switch (flag.type) {
        case 'in_heat':
          icon = <Heart className="h-4 w-4 fill-red-500 text-red-500" />;
          tooltipText = 'In Heat';
          color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          break;
        case 'incompatible':
          icon = <Slash className="h-4 w-4 text-amber-500" />;
          tooltipText = `Doesn't get along with ${flag.incompatible_with?.length} other dog(s)`;
          color = 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
          break;
        case 'special_attention':
          icon = <AlertCircle className="h-4 w-4 text-blue-500" />;
          tooltipText = flag.value || 'Needs special attention';
          color = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
          break;
        default:
          icon = <Flag className="h-4 w-4 text-gray-500" />;
          tooltipText = flag.value || 'Other flag';
          color = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }

      return (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`ml-1 ${color}`}>
                {icon}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Daily Care Dashboard</h2>
          <p className="text-muted-foreground">
            {format(date, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            {dogsStatus.filter(dog => dog.last_care !== null).length} of {dogsStatus.length} dogs cared for
          </div>
          <Progress value={careCompletionPercentage} className="w-24" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="cards">Cards View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-4">
          <ScrollArea className="h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
              {dogsStatus.map((dog) => (
                <Card key={dog.dog_id} className={`overflow-hidden ${!dog.last_care ? 'border-orange-300 dark:border-orange-800' : ''}`}>
                  <CardContent className="p-0">
                    <div className="flex items-start p-4">
                      <div className="flex-shrink-0 mr-4">
                        {dog.dog_photo ? (
                          <img
                            src={dog.dog_photo}
                            alt={dog.dog_name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Dog className="h-8 w-8 text-primary" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <h3 className="font-semibold text-lg">{dog.dog_name}</h3>
                          {renderDogFlags(dog.flags)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {dog.breed} • {dog.color}
                        </p>
                        
                        {dog.last_care ? (
                          <div className="mt-2 space-y-1">
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <PawPrint className="h-3 w-3 mr-1" />
                              {dog.last_care.category}: {dog.last_care.task_name}
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(parseISO(dog.last_care.timestamp), 'h:mm a')}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                              Needs care today
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <Dialog open={dialogOpen && selectedDogId === dog.dog_id} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant={dog.last_care ? "ghost" : "secondary"} 
                            size="sm"
                            onClick={() => handleAddCareLog(dog.dog_id)}
                          >
                            {dog.last_care ? "Update" : "Log Care"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {selectedDogId && (
                            <CareLogForm dogId={selectedDogId} onSuccess={handleCareLogSuccess} />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[60vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dog</TableHead>
                      <TableHead>Breed</TableHead>
                      <TableHead>Last Care</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Flags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dogsStatus.map((dog) => (
                      <TableRow key={dog.dog_id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {dog.dog_photo ? (
                              <img
                                src={dog.dog_photo}
                                alt={dog.dog_name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Dog className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <span>{dog.dog_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{dog.breed}</TableCell>
                        <TableCell>
                          {dog.last_care ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              {dog.last_care.category}: {dog.last_care.task_name}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                              Needs care
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {dog.last_care ? format(parseISO(dog.last_care.timestamp), 'h:mm a') : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex">
                            {renderDogFlags(dog.flags)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog open={dialogOpen && selectedDogId === dog.dog_id} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant={dog.last_care ? "ghost" : "secondary"} 
                                size="sm"
                                onClick={() => handleAddCareLog(dog.dog_id)}
                              >
                                {dog.last_care ? "Update" : "Log Care"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              {selectedDogId && (
                                <CareLogForm dogId={selectedDogId} onSuccess={handleCareLogSuccess} />
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Overall stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dogs Cared For</p>
                <h3 className="text-2xl font-bold">{dogsStatus.filter(dog => dog.last_care !== null).length} / {dogsStatus.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <PawPrint className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={careCompletionPercentage} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Need Attention</p>
                <h3 className="text-2xl font-bold">{dogsNeedingCare.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {dogsNeedingCare.length > 0 ? 
                `${dogsNeedingCare.map(d => d.dog_name).slice(0, 3).join(', ')}${dogsNeedingCare.length > 3 ? ` and ${dogsNeedingCare.length - 3} more` : ''}` : 
                'All dogs have been cared for today!'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Special Flags</p>
                <h3 className="text-2xl font-bold">
                  {dogsStatus.filter(dog => dog.flags && dog.flags.length > 0).length}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Flag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-red-100 text-red-800">
                <Heart className="h-3 w-3 mr-1 fill-red-500 text-red-500" />
                In Heat: {dogsStatus.filter(dog => dog.flags.some(f => f.type === 'in_heat')).length}
              </Badge>
              <Badge variant="outline" className="bg-amber-100 text-amber-800">
                <Slash className="h-3 w-3 mr-1 text-amber-500" />
                Incompatible: {dogsStatus.filter(dog => dog.flags.some(f => f.type === 'incompatible')).length}
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                <AlertCircle className="h-3 w-3 mr-1 text-blue-500" />
                Special: {dogsStatus.filter(dog => dog.flags.some(f => f.type === 'special_attention')).length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareDashboard;
