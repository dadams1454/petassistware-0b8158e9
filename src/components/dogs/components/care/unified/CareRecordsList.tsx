
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Filter, RefreshCw, Search, Plus } from 'lucide-react';

import CareRecordCard from './CareRecordCard';
import UnifiedCareForm from './UnifiedCareForm';
import { useCareRecords } from '@/contexts/careRecords';
import { CareRecord, CareCategory } from '@/types/careRecord';
import { careCategories } from '@/components/dogs/components/care/CareCategories';

interface CareRecordsListProps {
  dogId: string;
  initialCategory?: CareCategory;
  height?: string;
  enableFilters?: boolean;
  enableAddRecord?: boolean;
  defaultView?: 'all' | 'by-category';
}

const CareRecordsList: React.FC<CareRecordsListProps> = ({ 
  dogId,
  initialCategory,
  height = 'h-[500px]',
  enableFilters = true,
  enableAddRecord = true,
  defaultView = 'all'
}) => {
  // State for managing records
  const [records, setRecords] = useState<CareRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<CareRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CareCategory | 'all'>(
    initialCategory || 'all'
  );
  const [activeView, setActiveView] = useState<'all' | 'by-category'>(defaultView);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CareRecord | null>(null);
  
  // Fetch care records
  const { 
    fetchDogCareRecords, 
    deleteCareRecord, 
    loading 
  } = useCareRecords();
  
  // Load records on mount and when dogId changes
  useEffect(() => {
    loadRecords();
  }, [dogId]);
  
  // Apply filters when records, search text, selected category, or status changes
  useEffect(() => {
    applyFilters();
  }, [records, searchText, selectedCategory, selectedStatus]);
  
  // Load all care records for the dog
  const loadRecords = async () => {
    const data = await fetchDogCareRecords(dogId);
    setRecords(data);
  };
  
  // Apply filters to the records
  const applyFilters = () => {
    let filtered = [...records];
    
    // Filter by category if not 'all'
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(record => record.category === selectedCategory);
    }
    
    // Filter by status if not 'all'
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(record => {
        // Handle legacy records that might not have status
        const status = record.status || 'completed';
        return status === selectedStatus;
      });
    }
    
    // Filter by search text
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(record => 
        record.task_name.toLowerCase().includes(search) || 
        (record.notes && record.notes.toLowerCase().includes(search))
      );
    }
    
    // Set filtered records
    setFilteredRecords(filtered);
  };
  
  // Handle record deletion
  const handleDeleteRecord = async () => {
    if (selectedRecord) {
      const success = await deleteCareRecord(selectedRecord.id);
      if (success) {
        await loadRecords();
      }
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };
  
  // Handle record editing
  const handleEditRecord = (record: CareRecord) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };
  
  // Confirm record deletion
  const confirmDeleteRecord = (record: CareRecord) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };
  
  // Handle category tab change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as CareCategory | 'all');
  };
  
  // Group records by date
  const groupedRecords: Record<string, CareRecord[]> = {};
  filteredRecords.forEach(record => {
    const date = new Date(record.timestamp).toDateString();
    if (!groupedRecords[date]) {
      groupedRecords[date] = [];
    }
    groupedRecords[date].push(record);
  });
  
  const renderedTabs = (
    <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'all' | 'by-category')}>
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="all">All Records</TabsTrigger>
        <TabsTrigger value="by-category">By Category</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        {/* Records grouped by date */}
        {Object.keys(groupedRecords).length > 0 ? (
          <div className="space-y-6">
            {Object.keys(groupedRecords)
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
                      <CareRecordCard
                        key={record.id}
                        record={record}
                        onEdit={handleEditRecord}
                        onDelete={confirmDeleteRecord}
                      />
                    ))
                  }
                </div>
              ))
            }
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-muted-foreground">No care records found</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="by-category">
        <Tabs 
          defaultValue={initialCategory || careCategories[0]?.id || 'pottybreaks'}
          onValueChange={handleCategoryChange}
        >
          <TabsList className="flex flex-wrap h-auto mb-4">
            {careCategories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="px-3 py-1 data-[state=active]:bg-primary/10"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {careCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              {filteredRecords.length > 0 ? (
                <div className="space-y-3">
                  {filteredRecords
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map(record => (
                      <CareRecordCard
                        key={record.id}
                        record={record}
                        onEdit={handleEditRecord}
                        onDelete={confirmDeleteRecord}
                      />
                    ))
                  }
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-muted-foreground">No {category.name.toLowerCase()} records found</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </TabsContent>
    </Tabs>
  );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Care Records</CardTitle>
            <CardDescription>
              {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            {enableAddRecord && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadRecords} 
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {enableFilters && (
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records"
                className="pl-8"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Select 
              value={selectedStatus} 
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <ScrollArea className={height}>
          <div className="pr-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : renderedTabs}
          </div>
        </ScrollArea>
        
        {/* Add Record Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-md">
            <UnifiedCareForm 
              dogId={dogId}
              initialCategory={initialCategory}
              onSuccess={() => {
                setAddDialogOpen(false);
                loadRecords();
              }}
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Record Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            {selectedRecord && (
              <UnifiedCareForm 
                dogId={dogId}
                recordId={selectedRecord.id}
                initialValues={{
                  category: selectedRecord.category as CareCategory,
                  task_name: selectedRecord.task_name,
                  timestamp: new Date(selectedRecord.timestamp),
                  notes: selectedRecord.notes || '',
                  status: selectedRecord.status as 'completed' | 'scheduled' | 'missed' || 'completed',
                  assigned_to: selectedRecord.assigned_to || '',
                  follow_up_needed: selectedRecord.follow_up_needed || false,
                  follow_up_notes: selectedRecord.follow_up_notes || '',
                  follow_up_date: selectedRecord.follow_up_date ? new Date(selectedRecord.follow_up_date) : null
                }}
                onSuccess={() => {
                  setEditDialogOpen(false);
                  loadRecords();
                  setSelectedRecord(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Care Record</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this care record? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedRecord(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteRecord}
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

export default CareRecordsList;
