
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useDailyCare } from '@/contexts/DailyCareProvider';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import DogCareCard from './DogCareCard';
import DogCareTable from './DogCareTable';
import DogCareStatCards from './DogCareStatCards';

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
  const { fetchAllDogsWithCareStatus } = useDailyCare();

  useEffect(() => {
    const loadDogCareStatus = async () => {
      setLoading(true);
      try {
        const statuses = await fetchAllDogsWithCareStatus(date);
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

    loadDogCareStatus();
  }, [date, fetchAllDogsWithCareStatus, toast]);

  const handleCareLogSuccess = () => {
    setDialogOpen(false);
    // Refresh dog statuses after a successful care log
    fetchAllDogsWithCareStatus(date).then(statuses => {
      setDogsStatus(statuses);
    });
    
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                <DogCareCard
                  key={dog.dog_id}
                  dog={dog}
                  onLogCare={handleAddCareLog}
                  selectedDogId={selectedDogId}
                  dialogOpen={dialogOpen}
                  setDialogOpen={setDialogOpen}
                  onCareLogSuccess={handleCareLogSuccess}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <DogCareTable
            dogsStatus={dogsStatus}
            onLogCare={handleAddCareLog}
            selectedDogId={selectedDogId}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            onCareLogSuccess={handleCareLogSuccess}
          />
        </TabsContent>
      </Tabs>

      {/* Overall stats summary */}
      <DogCareStatCards
        dogsStatus={dogsStatus}
        careCompletionPercentage={careCompletionPercentage}
      />
    </div>
  );
};

export default CareDashboard;
