
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive, CirclePlus, Folder, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import LitterForm from '@/components/litters/LitterForm';
import { useLitterManagement } from '../../hooks/useLitterManagement';
import { Litter } from '@/types/litter';
import EmptyState from '@/components/common/EmptyState';

const LitterOverviewTab: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLitter, setSelectedLitter] = useState<Litter | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  const { 
    litters, 
    isLoading, 
    createLitter, 
    updateLitter, 
    deleteLitter, 
    archiveLitter, 
    unarchiveLitter,
    refetchLitters
  } = useLitterManagement();
  
  const handleCreateLitter = () => {
    setSelectedLitter(null);
    setIsDialogOpen(true);
  };

  const handleEditLitter = (litter: Litter) => {
    setSelectedLitter(litter);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedLitter(null);
  };

  const handleLitterFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedLitter(null);
    refetchLitters();
  };
  
  // Organize litters by status
  const organizedLitters = litters.reduce(
    (acc: { active: Litter[]; other: Litter[]; archived: Litter[] }, litter) => {
      if (litter.status === 'archived') {
        acc.archived.push(litter);
      } else if (litter.dam?.gender === 'Female') {
        acc.active.push(litter);
      } else {
        acc.other.push(litter);
      }
      return acc;
    },
    { active: [], other: [], archived: [] }
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading litters...</span>
      </div>
    );
  }
  
  if (litters.length === 0) {
    return (
      <EmptyState
        title="No Litters Found"
        description="You haven't created any litters yet. Create a litter to start tracking puppies."
        icon={<Folder className="h-10 w-10 text-muted-foreground" />}
        action={{
          label: "Create Litter",
          onClick: handleCreateLitter,
        }}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Litters</h2>
        <div className="flex gap-2">
          <div className="bg-muted rounded-lg p-1 inline-flex">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-md px-3"
              onClick={() => setViewMode('cards')}
            >
              <Folder className="h-4 w-4 mr-2" />
              Cards
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-md px-3"
              onClick={() => setViewMode('table')}
            >
              <Folder className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
          <Button onClick={handleCreateLitter}>
            <CirclePlus className="h-4 w-4 mr-2" />
            Add Litter
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Dam Litters ({organizedLitters.active.length})</TabsTrigger>
          <TabsTrigger value="other">Other Litters ({organizedLitters.other.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({organizedLitters.archived.length})</TabsTrigger>
        </TabsList>
        
        <Card className="mt-4 border-t-0 rounded-tl-none rounded-tr-none">
          <CardContent className="p-6">
            {viewMode === 'cards' ? (
              <LitterCardsView 
                litters={organizedLitters}
                onEditLitter={handleEditLitter}
                onDeleteLitter={deleteLitter}
                onArchiveLitter={archiveLitter}
                onUnarchiveLitter={unarchiveLitter}
              />
            ) : (
              <LitterTableView 
                litters={litters}
                onEditLitter={handleEditLitter}
                onDeleteLitter={deleteLitter}
                onArchiveLitter={archiveLitter}
                onUnarchiveLitter={unarchiveLitter}
              />
            )}
          </CardContent>
        </Card>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <LitterForm 
            initialData={selectedLitter}
            onSuccess={handleLitterFormSuccess}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for card view
const LitterCardsView: React.FC<{
  litters: { active: Litter[]; other: Litter[]; archived: Litter[] };
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litterId: string) => Promise<void>;
  onArchiveLitter: (litter: Litter) => Promise<void>;
  onUnarchiveLitter: (litter: Litter) => Promise<void>;
}> = ({ litters, onEditLitter, onDeleteLitter, onArchiveLitter, onUnarchiveLitter }) => {
  // Implementation of card view
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {litters.active.map(litter => (
          <LitterCard 
            key={litter.id} 
            litter={litter} 
            onEdit={onEditLitter}
            onDelete={onDeleteLitter}
            onArchive={onArchiveLitter}
            onUnarchive={onUnarchiveLitter}
          />
        ))}
      </div>
    </div>
  );
};

// Helper component for table view
const LitterTableView: React.FC<{
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litterId: string) => Promise<void>;
  onArchiveLitter: (litter: Litter) => Promise<void>;
  onUnarchiveLitter: (litter: Litter) => Promise<void>;
}> = ({ litters, onEditLitter, onDeleteLitter, onArchiveLitter, onUnarchiveLitter }) => {
  // Implementation of table view
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Name</th>
            <th className="text-left py-3 px-4">Dam</th>
            <th className="text-left py-3 px-4">Sire</th>
            <th className="text-left py-3 px-4">Birth Date</th>
            <th className="text-left py-3 px-4">Puppies</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {litters.map(litter => (
            <tr key={litter.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">{litter.litter_name || "Unnamed Litter"}</td>
              <td className="py-3 px-4">{litter.dam?.name || "Unknown"}</td>
              <td className="py-3 px-4">{litter.sire?.name || "Unknown"}</td>
              <td className="py-3 px-4">{litter.birth_date}</td>
              <td className="py-3 px-4">
                {typeof litter.puppies === 'number' 
                  ? litter.puppies 
                  : Array.isArray(litter.puppies) 
                    ? litter.puppies.length 
                    : (litter.puppies as any)?.count || 0}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  litter.status === 'active' ? 'bg-green-100 text-green-800' :
                  litter.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {litter.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditLitter(litter)}
                  >
                    Edit
                  </Button>
                  {litter.status === 'archived' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onUnarchiveLitter(litter)}
                    >
                      Unarchive
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onArchiveLitter(litter)}
                    >
                      Archive
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDeleteLitter(litter.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Litter card component
const LitterCard: React.FC<{
  litter: Litter;
  onEdit: (litter: Litter) => void;
  onDelete: (litterId: string) => Promise<void>;
  onArchive: (litter: Litter) => Promise<void>;
  onUnarchive: (litter: Litter) => Promise<void>;
}> = ({ litter, onEdit, onDelete, onArchive, onUnarchive }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{litter.litter_name || "Unnamed Litter"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Dam:</span>
            <span className="text-sm font-medium">{litter.dam?.name || "Unknown"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Sire:</span>
            <span className="text-sm font-medium">{litter.sire?.name || "Unknown"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Birth Date:</span>
            <span className="text-sm font-medium">{litter.birth_date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Puppies:</span>
            <span className="text-sm font-medium">
              {typeof litter.puppies === 'number' 
                ? litter.puppies 
                : Array.isArray(litter.puppies) 
                  ? litter.puppies.length 
                  : (litter.puppies as any)?.count || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className="text-sm font-medium capitalize">{litter.status}</span>
          </div>
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-2 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onEdit(litter)}
        >
          Edit
        </Button>
        {litter.status === 'archived' ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onUnarchive(litter)}
          >
            <Archive className="h-4 w-4 mr-1" />
            Unarchive
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onArchive(litter)}
          >
            <Archive className="h-4 w-4 mr-1" />
            Archive
          </Button>
        )}
        <Button 
          variant="destructive" 
          size="sm" 
          className="flex-1"
          onClick={() => onDelete(litter.id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default LitterOverviewTab;
