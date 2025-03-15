import React, { useEffect, useState } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from './LoadingSpinner';
import DogCareStatCards from './DogCareStatCards';
import CareDashboardHeader from './CareDashboardHeader';
import CareTabsContent from './CareTabsContent';
import { DogCareStatus } from '@/types/dailyCare';

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
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <CareDashboardHeader 
        date={date}
        careCompletionPercentage={careCompletionPercentage}
        totalDogs={dogsStatus.length}
        caredDogs={dogsStatus.filter(dog => dog.last_care !== null).length}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="cards">Cards View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <CareTabsContent 
          activeTab={activeTab}
          dogsStatus={dogsStatus}
          onLogCare={handleAddCareLog}
          selectedDogId={selectedDogId}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onCareLogSuccess={handleCareLogSuccess}
        />
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
