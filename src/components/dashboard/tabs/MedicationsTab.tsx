
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Pill, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import MedicationTracker from '../../dogs/components/health/MedicationTracker';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const MedicationsTab: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [medicationCounts, setMedicationCounts] = React.useState({
    today: 0,
    pending: 0,
    upcoming: 0
  });
  
  React.useEffect(() => {
    const fetchMedicationCounts = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];
        
        // Get today's count
        const { count: todayCount, error: todayError } = await supabase
          .from('health_records')
          .select('*', { count: 'exact', head: true })
          .eq('record_type', 'medication')
          .eq('next_due_date', today);
          
        if (todayError) throw todayError;
        
        // Get pending count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('health_records')
          .select('*', { count: 'exact', head: true })
          .eq('record_type', 'medication')
          .lte('next_due_date', today);
          
        if (pendingError) throw pendingError;
        
        // Get upcoming count
        const { count: upcomingCount, error: upcomingError } = await supabase
          .from('health_records')
          .select('*', { count: 'exact', head: true })
          .eq('record_type', 'medication')
          .gt('next_due_date', today)
          .lte('next_due_date', nextWeekStr);
          
        if (upcomingError) throw upcomingError;
        
        setMedicationCounts({
          today: todayCount || 0,
          pending: pendingCount || 0,
          upcoming: upcomingCount || 0
        });
      } catch (error) {
        console.error('Error fetching medication counts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load medication counts',
          variant: 'destructive'
        });
      }
    };
    
    fetchMedicationCounts();
  }, [toast]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-purple-500" />
          <span>Medication Tracking</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-medium mb-2">Medication Management</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Track preventative medications and treatments for all dogs.
          </p>
          <Button
            variant="outline"
            className="bg-white dark:bg-background"
            onClick={() => navigate("/dogs")}
          >
            Manage Medications <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Today's Doses</h4>
            <div className="text-2xl font-bold mb-1">{medicationCounts.today}</div>
            <p className="text-xs text-muted-foreground">
              Medications due today
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Pending</h4>
            <div className="text-2xl font-bold mb-1">{medicationCounts.pending}</div>
            <p className="text-xs text-muted-foreground">
              Medications due today or overdue
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Upcoming</h4>
            <div className="text-2xl font-bold mb-1">{medicationCounts.upcoming}</div>
            <p className="text-xs text-muted-foreground">
              Due in the next 7 days
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              <Clock className="h-4 w-4 mr-2" />
              Upcoming Medications
            </TabsTrigger>
            <TabsTrigger value="expiring">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Expiring Medications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="pt-4">
            <MedicationTracker />
          </TabsContent>
          
          <TabsContent value="expiring" className="pt-4">
            <MedicationTracker />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicationsTab;
