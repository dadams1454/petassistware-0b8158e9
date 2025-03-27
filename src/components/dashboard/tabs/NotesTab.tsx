
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, StickyNote, Search, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isToday, isYesterday, isThisWeek } from 'date-fns';
import { DogCareStatus } from '@/types/dailyCare';
import DogNotesForm from '@/components/dogs/components/care/notes/DogNotesForm';
import DogNoteView from '@/components/dogs/components/care/notes/DogNoteView';
import { EmptyState } from '@/components/ui/standardized';

interface NotesTabProps {
  dogStatuses: DogCareStatus[];
  onRefreshDogs: () => void;
}

const NotesTab: React.FC<NotesTabProps> = ({ dogStatuses, onRefreshDogs }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  
  // Fetch all notes
  const { data: notes, isLoading, refetch } = useQuery({
    queryKey: ['dogNotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_care_logs')
        .select(`
          id,
          dog_id,
          notes,
          task_name,
          timestamp,
          created_by,
          dogs:dog_id(name)
        `)
        .eq('category', 'notes')
        .order('timestamp', { ascending: false });
        
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load notes',
          variant: 'destructive'
        });
        throw error;
      }
      
      return data || [];
    }
  });
  
  // Filter notes based on search query
  const filteredNotes = notes?.filter(note => {
    const dogName = note.dogs?.name || '';
    const noteContent = note.notes || '';
    const noteTitle = note.task_name || '';
    
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      dogName.toLowerCase().includes(searchLower) ||
      noteContent.toLowerCase().includes(searchLower) ||
      noteTitle.toLowerCase().includes(searchLower)
    );
  });
  
  // Group notes by date
  const groupedNotes = filteredNotes?.reduce((groups: Record<string, any[]>, note) => {
    const date = new Date(note.timestamp);
    let dateGroup = format(date, 'yyyy-MM-dd');
    
    if (isToday(date)) {
      dateGroup = 'Today';
    } else if (isYesterday(date)) {
      dateGroup = 'Yesterday';
    } else if (isThisWeek(date)) {
      dateGroup = 'This Week';
    }
    
    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    
    groups[dateGroup].push(note);
    return groups;
  }, {});
  
  const handleAddNote = (dogId: string) => {
    const dog = dogStatuses.find(dog => dog.dog_id === dogId);
    if (dog) {
      setSelectedDogId(dogId);
      setEditingNote(null);
      setIsDialogOpen(true);
    }
  };
  
  const handleEditNote = (note: any) => {
    setSelectedDogId(note.dog_id);
    setEditingNote({
      id: note.id,
      content: note.notes,
      title: note.task_name
    });
    setIsDialogOpen(true);
  };
  
  const handleNoteSuccess = () => {
    setIsDialogOpen(false);
    setEditingNote(null);
    refetch();
    onRefreshDogs();
  };
  
  const handleNoteDelete = () => {
    refetch();
    onRefreshDogs();
  };
  
  const selectedDog = dogStatuses.find(dog => dog.dog_id === selectedDogId);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-10 gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          
          <Button variant="outline" size="sm" className="h-10 gap-1">
            <Calendar className="h-4 w-4" />
            <span>Date</span>
          </Button>
          
          <Button onClick={() => handleAddNote(dogStatuses[0]?.dog_id)}>
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Note</span>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredNotes?.length ? (
        <div className="space-y-8">
          {Object.entries(groupedNotes || {}).map(([dateGroup, dateNotes]) => (
            <div key={dateGroup}>
              <h3 className="text-lg font-semibold mb-3">{dateGroup}</h3>
              <div className="space-y-4">
                {dateNotes.map(note => (
                  <DogNoteView
                    key={note.id}
                    noteId={note.id}
                    title={note.task_name || `Note for ${note.dogs?.name || 'Dog'}`}
                    content={note.notes}
                    timestamp={note.timestamp}
                    staffName={note.staff?.full_name}
                    onEdit={() => handleEditNote(note)}
                    onDelete={handleNoteDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10">
            <EmptyState
              icon={<StickyNote className="h-12 w-12 text-muted-foreground" />}
              title="No Notes Found"
              description={searchQuery ? "No notes match your search criteria. Try a different search term." : "Start adding notes to keep track of important observations about your dogs."}
              action={{
                label: "Add Note",
                onClick: () => dogStatuses.length > 0 && handleAddNote(dogStatuses[0].dog_id)
              }}
            />
          </CardContent>
        </Card>
      )}
      
      {/* Add/Edit Note Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? 'Edit Note' : 'Add Note'} for {selectedDog?.dog_name || 'Dog'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDog && (
            <DogNotesForm
              dogId={selectedDog.dog_id}
              dogName={selectedDog.dog_name}
              onSuccess={handleNoteSuccess}
              onCancel={() => setIsDialogOpen(false)}
              existingNote={editingNote}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Quick Add Note Button (Mobile friendly) */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => dogStatuses.length > 0 && handleAddNote(dogStatuses[0].dog_id)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default NotesTab;
