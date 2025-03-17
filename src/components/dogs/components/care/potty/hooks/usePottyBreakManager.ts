
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PottyBreakSession, createPottyBreakSession, getRecentPottyBreakSessions } from '@/services/dailyCare/pottyBreak';
import { DogCareStatus } from '@/types/dailyCare';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const usePottyBreakManager = (dogs: DogCareStatus[], onRefresh: () => void) => {
  const [activeTab, setActiveTab] = useState('quick');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [recentSessions, setRecentSessions] = useState<PottyBreakSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

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

  // Get time since last potty break
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

  return {
    activeTab,
    setActiveTab,
    dialogOpen,
    setDialogOpen,
    selectedDogs,
    setSelectedDogs,
    recentSessions,
    isLoading,
    refreshTrigger,
    setRefreshTrigger,
    handleQuickPottyBreak,
    handleGroupPottyBreak,
    getTimeSinceLastPottyBreak,
    sortedDogs
  };
};
