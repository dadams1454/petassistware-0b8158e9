
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Calendar, Clock, FileText } from 'lucide-react';

import { useDailyCare } from '@/contexts/DailyCareProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CareLogsListProps {
  dogId: string;
  height?: string;
  onLogDeleted?: () => void;
}

const CareLogsList: React.FC<CareLogsListProps> = ({ dogId, height = 'h-[400px]', onLogDeleted }) => {
  const { fetchDogCareLogs, deleteCareLog, loading } = useDailyCare();
  const [logs, setLogs] = useState<DailyCarelog[]>([]);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, [dogId]);

  const loadLogs = async () => {
    const data = await fetchDogCareLogs(dogId);
    setLogs(data);
  };

  const handleDeleteLog = async () => {
    if (selectedLogId) {
      const success = await deleteCareLog(selectedLogId);
      if (success) {
        await loadLogs();
        if (onLogDeleted) {
          onLogDeleted();
        }
      }
      setSelectedLogId(null);
    }
  };

  // Group logs by date
  const groupedLogs: Record<string, DailyCarelog[]> = {};
  logs.forEach(log => {
    const date = new Date(log.timestamp).toDateString();
    if (!groupedLogs[date]) {
      groupedLogs[date] = [];
    }
    groupedLogs[date].push(log);
  });

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Feeding': 'bg-blue-500',
      'Grooming': 'bg-pink-500',
      'Exercise': 'bg-green-500',
      'Medications': 'bg-red-500',
      'Potty Breaks': 'bg-yellow-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Care Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={`${height} pr-4`}>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No care logs recorded yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map(date => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">
                      {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {groupedLogs[date].sort((a, b) => 
                      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    ).map(log => (
                      <Card key={log.id} className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge 
                                className={`${getCategoryColor(log.category)} text-white`}
                              >
                                {log.category}
                              </Badge>
                              <h4 className="font-medium">{log.task_name}</h4>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(log.timestamp), 'h:mm a')}
                            </div>
                            {log.notes && (
                              <p className="text-sm mt-2">
                                {log.notes}
                              </p>
                            )}
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => setSelectedLogId(log.id)}
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Care Log</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this care log? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setSelectedLogId(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDeleteLog}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CareLogsList;
