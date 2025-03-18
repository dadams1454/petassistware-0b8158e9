
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PottyBreakSession, createPottyBreakSession, getRecentPottyBreakSessions, deletePottyBreakSession } from '@/services/dailyCare/pottyBreak';
import { DogCareStatus } from '@/types/dailyCare';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const usePottyBreakManager = (dogs: DogCareStatus[], onRefresh: () => void) => {
  const [activeTab, setActiveTab] = useState('quick');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [recentSessions, setRecentSessions] = useState<PottyBreakSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [groupNotes, setGroupNotes] = useState('');
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
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
          title: 'Database Connection Error',
          description: 'Failed to load recent potty breaks. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentSessions();
  }, [toast, refreshTrigger]);

  // Handler for quick potty break logging
  const handleQuickPottyBreak = async (dogId: string, dogName: string, notes?: string) => {
    try {
      setIsLoading(true);
      await createPottyBreakSession({ dogs: [dogId], notes });
      toast({
        title: 'Potty Break Logged',
        description: `${dogName} was taken out for a potty break${notes ? ' with notes' : ''}.`,
      });
      setRefreshTrigger(prev => prev + 1);
      onRefresh();
    } catch (error) {
      console.error('Error logging quick potty break:', error);
      toast({
        title: 'Database Error',
        description: 'Failed to log potty break. Supabase might be experiencing issues.',
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
      await createPottyBreakSession({ 
        dogs: selectedDogs,
        notes: groupNotes.trim() || undefined
      });
      toast({
        title: 'Group Potty Break Logged',
        description: `${selectedDogs.length} dogs were taken out for a potty break${groupNotes ? ' with notes' : ''}.`,
      });
      setDialogOpen(false);
      setSelectedDogs([]);
      setGroupNotes('');
      setRefreshTrigger(prev => prev + 1);
      onRefresh();
    } catch (error) {
      console.error('Error logging group potty break:', error);
      toast({
        title: 'Database Error',
        description: 'Failed to log group potty break. The database may be experiencing issues.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for deleting potty break session
  const handleDeletePottyBreakSession = async (sessionId: string) => {
    try {
      setDeletingSessionId(sessionId);
      await deletePottyBreakSession(sessionId);
      toast({
        title: 'Potty Break Deleted',
        description: 'The potty break record has been successfully deleted.',
      });
      setRefreshTrigger(prev => prev + 1);
      onRefresh();
    } catch (error) {
      console.error('Error deleting potty break session:', error);
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete potty break record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingSessionId(null);
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
    handleDeletePottyBreakSession,
    getTimeSinceLastPottyBreak,
    sortedDogs,
    groupNotes,
    setGroupNotes,
    deletingSessionId
  };
};
