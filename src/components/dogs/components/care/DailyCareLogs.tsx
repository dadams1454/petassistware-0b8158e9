
import React, { useState, useEffect } from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import { DailyCarelog } from '@/types/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CareLogForm from './CareLogForm';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

interface DailyCareLogsProps {
  dogId: string;
}

const DailyCareLogs: React.FC<DailyCareLogsProps> = ({ dogId }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [logs, setLogs] = useState<DailyCarelog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { fetchDogCareLogs, deleteCareLog } = useDailyCare();
  const { toast } = useToast();

  // Fetch care logs when component mounts or refreshTrigger changes
  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const fetchedLogs = await fetchDogCareLogs(dogId);
        setLogs(fetchedLogs);
      } catch (error) {
        console.error('Error fetching care logs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [dogId, fetchDogCareLogs, refreshTrigger]);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(logs.map(log => log.category)))];

  // Filter logs by active category
  const filteredLogs = activeTab === 'all'
    ? logs
    : logs.filter(log => log.category === activeTab);

  // Handle log deletion
  const handleDeleteLog = async (logId: string) => {
    try {
      const success = await deleteCareLog(logId);
      if (success) {
        toast({
          title: 'Care log deleted',
          description: 'The care log has been successfully removed',
        });
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error deleting log:', error);
      toast({
        title: 'Error',
        description: 'Could not delete the care log',
        variant: 'destructive',
      });
    }
  };

  // Group logs by date
  const groupedLogs: Record<string, DailyCarelog[]> = {};
  filteredLogs.forEach(log => {
    const date = format(parseISO(log.timestamp), 'yyyy-MM-dd');
    if (!groupedLogs[date]) {
      groupedLogs[date] = [];
    }
    groupedLogs[date].push(log);
  });

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Daily Care Logs</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Care Log
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CareLogForm 
              dogId={dogId} 
              onSuccess={() => {
                setDialogOpen(false);
                setRefreshTrigger(prev => prev + 1);
              }} 
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex flex-wrap">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="text-center py-4">Loading care logs...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No {activeTab === 'all' ? '' : activeTab} care logs found for this dog.
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDates.map(date => (
                  <div key={date}>
                    <h3 className="font-medium mb-2">
                      {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <div className="space-y-3">
                      {groupedLogs[date]
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map(log => (
                          <div key={log.id} className="border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{log.task_name}</h4>
                                  <Badge variant="outline" className="capitalize">
                                    {log.category}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {format(parseISO(log.timestamp), 'h:mm a')}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteLog(log.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                            {log.notes && (
                              <>
                                <Separator className="my-2" />
                                <p className="text-sm">{log.notes}</p>
                              </>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DailyCareLogs;
