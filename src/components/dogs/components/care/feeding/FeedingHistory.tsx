
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash, AlertCircle, Clock, Check } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { FeedingRecord, FeedingSchedule } from '@/types/feeding';
import { useFeeding } from '@/contexts/feeding';
import FeedingForm from './FeedingForm';

interface FeedingHistoryProps {
  dogId: string;
  records: FeedingRecord[];
  schedules: FeedingSchedule[];
  onRefresh: () => void;
  height?: string;
}

const FeedingHistory: React.FC<FeedingHistoryProps> = ({
  dogId,
  records,
  schedules,
  onRefresh,
  height = 'h-[400px]'
}) => {
  const { deleteFeedingLog } = useFeeding();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeedingRecord | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleEditClick = (record: FeedingRecord) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (record: FeedingRecord) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRecord) {
      await deleteFeedingLog(selectedRecord.id);
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
      onRefresh();
    }
  };

  // Filter records based on active tab
  const filteredRecords = records.filter(record => {
    if (activeTab === 'all') return true;
    if (activeTab === 'refused') return record.refused;
    return false;
  });

  // Group records by date
  const groupedRecords: Record<string, FeedingRecord[]> = {};
  filteredRecords.forEach(record => {
    const date = new Date(record.timestamp).toDateString();
    if (!groupedRecords[date]) {
      groupedRecords[date] = [];
    }
    groupedRecords[date].push(record);
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Feeding History</CardTitle>
            <CardDescription>
              {records.length} record{records.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-1" />
            Log Feeding
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="refused">Refused</TabsTrigger>
          </TabsList>

          <ScrollArea className={height}>
            <div className="space-y-6">
              {Object.keys(groupedRecords).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No feeding records found
                </div>
              ) : (
                Object.keys(groupedRecords)
                  .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                  .map(date => (
                    <div key={date} className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {new Date(date).toLocaleDateString(undefined, { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                      {groupedRecords[date]
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map(record => (
                          <div 
                            key={record.id}
                            className={`border rounded-lg p-3 ${record.refused ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-medium">{record.food_type}</h3>
                                  {record.meal_type && (
                                    <Badge variant="outline" className="ml-2">
                                      {record.meal_type.charAt(0).toUpperCase() + record.meal_type.slice(1)}
                                    </Badge>
                                  )}
                                  {record.refused && (
                                    <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Refused
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {format(new Date(record.timestamp), 'h:mm a')}
                                </div>
                              </div>
                              <div>
                                {record.amount_offered && (
                                  <p className="text-sm">
                                    <span className="font-medium">Offered:</span> {record.amount_offered}
                                  </p>
                                )}
                                {record.amount_consumed && !record.refused && (
                                  <p className="text-sm">
                                    <span className="font-medium">Consumed:</span> {record.amount_consumed}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {record.notes && (
                              <p className="mt-2 text-sm">
                                <span className="font-medium">Notes:</span> {record.notes}
                              </p>
                            )}
                            
                            <div className="mt-2 flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(record)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteClick(record)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ))
              )}
            </div>
          </ScrollArea>
        </Tabs>
        
        {/* Add Feeding Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-md">
            <FeedingForm 
              dogId={dogId}
              schedules={schedules}
              onSuccess={() => {
                setAddDialogOpen(false);
                onRefresh();
              }}
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Feeding Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            {selectedRecord && (
              <FeedingForm 
                dogId={dogId}
                recordId={selectedRecord.id}
                schedules={schedules}
                initialValues={{
                  food_type: selectedRecord.food_type,
                  amount_offered: selectedRecord.amount_offered,
                  amount_consumed: selectedRecord.amount_consumed,
                  meal_type: selectedRecord.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack' | undefined,
                  refused: selectedRecord.refused || false,
                  notes: selectedRecord.notes || '',
                  timestamp: new Date(selectedRecord.timestamp),
                  schedule_id: selectedRecord.schedule_id
                }}
                onSuccess={() => {
                  setEditDialogOpen(false);
                  setSelectedRecord(null);
                  onRefresh();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Feeding Record</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this feeding record? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedRecord(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default FeedingHistory;
