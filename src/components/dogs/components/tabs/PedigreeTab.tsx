
import React, { useState } from 'react';
import { Plus, TreeDeciduous, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDogRelationships } from '../../hooks/useDogRelationships';
import RelationshipSection from '../pedigree/RelationshipSection';
import AddRelationshipForm from '../pedigree/AddRelationshipForm';
import PedigreeChart from '../pedigree/PedigreeChart';
import PedigreeScanDialog from '../pedigree/PedigreeScanDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface PedigreeTabProps {
  dogId: string;
  currentDog: any;
}

const PedigreeTab = ({ dogId, currentDog }: PedigreeTabProps) => {
  const { relationships, isLoading, addRelationship, removeRelationship } = useDogRelationships(dogId);
  const [isAdding, setIsAdding] = useState(false);
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch all dogs for the pedigree chart
  const { data: allDogs, refetch: refetchAllDogs } = useQuery({
    queryKey: ['allDogs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('dogs')
        .select('id, name, breed, gender, color, photo_url');
      return data || [];
    }
  });

  // Filter relationships by type
  const parentRelationships = relationships?.filter(r => 
    (r.dog_id === dogId && r.relationship_type === 'parent') ||
    (r.related_dog_id === dogId && r.relationship_type === 'offspring')
  ) || [];

  const childRelationships = relationships?.filter(r => 
    (r.dog_id === dogId && r.relationship_type === 'offspring') ||
    (r.related_dog_id === dogId && r.relationship_type === 'parent')
  ) || [];

  const handleSubmit = async (values: any) => {
    await addRelationship.mutateAsync({
      relatedDogId: values.relatedDogId,
      type: values.type
    });
    setIsAdding(false);
  };

  const handlePedigreeExtracted = async (pedigreeData: any) => {
    console.log('Extracted pedigree data:', pedigreeData);
    
    if (!pedigreeData || Object.keys(pedigreeData).length === 0) {
      toast({
        title: 'No data extracted',
        description: 'Could not extract enough information from the pedigree document',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if we have sire/dam information to add as relationships
      if (pedigreeData.sire || pedigreeData.dam) {
        // For demonstration, we'll just show a success message
        // In a real implementation, you would:
        // 1. Check if the sire/dam already exist in the database
        // 2. If not, create them as new dog entries
        // 3. Create the relationships with the current dog
        
        toast({
          title: 'Pedigree information extracted',
          description: `Found information about ${pedigreeData.sire ? 'sire' : ''} ${pedigreeData.sire && pedigreeData.dam ? 'and' : ''} ${pedigreeData.dam ? 'dam' : ''}`,
        });
      }
      
      setIsScanDialogOpen(false);
    } catch (error) {
      console.error('Error processing pedigree data:', error);
      toast({
        title: 'Error processing data',
        description: 'Failed to process the extracted pedigree information',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-400">Loading pedigree information...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TreeDeciduous className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Family Tree</h2>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsScanDialogOpen(true)}
            size="sm"
            variant="outline"
            className="gap-1"
          >
            <Scan className="h-4 w-4" /> 
            Scan Pedigree
          </Button>
          
          {!isAdding && (
            <Button 
              onClick={() => setIsAdding(true)}
              size="sm"
              className="gap-1"
            >
              <Plus className="h-4 w-4" /> 
              Add Relationship
            </Button>
          )}
        </div>
      </div>

      {isAdding && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add New Relationship</CardTitle>
            <CardDescription>
              Connect {currentDog.name} with other dogs in your kennel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddRelationshipForm 
              dogName={currentDog.name}
              onSubmit={handleSubmit}
              onCancel={() => setIsAdding(false)}
            />
          </CardContent>
        </Card>
      )}

      <PedigreeChart 
        dogId={dogId}
        relationships={relationships || []}
        allDogs={allDogs || []}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parents Section */}
        <RelationshipSection
          title="Parents"
          description={parentRelationships.length > 0 
            ? `${currentDog.name}'s parents` 
            : `No parents recorded for ${currentDog.name}`}
          emptyText={`No parents have been added yet`}
          dogId={dogId}
          currentDog={currentDog}
          relationships={parentRelationships}
          relationshipType="parent"
          onRemoveRelationship={(id) => removeRelationship.mutate(id)}
          onAddClick={() => {
            setIsAdding(true);
          }}
        />

        {/* Offspring Section */}
        <RelationshipSection
          title="Offspring"
          description={childRelationships.length > 0 
            ? `${currentDog.name}'s offspring` 
            : `No offspring recorded for ${currentDog.name}`}
          emptyText={`No offspring have been added yet`}
          dogId={dogId}
          currentDog={currentDog}
          relationships={childRelationships}
          relationshipType="offspring"
          onRemoveRelationship={(id) => removeRelationship.mutate(id)}
          onAddClick={() => {
            setIsAdding(true);
          }}
        />
      </div>
      
      {/* Pedigree Scan Dialog */}
      <PedigreeScanDialog 
        isOpen={isScanDialogOpen}
        onClose={() => setIsScanDialogOpen(false)}
        onPedigreeExtracted={handlePedigreeExtracted}
      />
    </div>
  );
};

export default PedigreeTab;
