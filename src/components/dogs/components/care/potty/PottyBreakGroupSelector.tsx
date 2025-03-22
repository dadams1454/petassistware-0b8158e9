
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchDogGroups, fetchGroupMembers, DogGroup } from '@/services/dailyCare/dogGroupsService';
import { DogCareStatus } from '@/types/dailyCare';
import { Users, AlertTriangle } from 'lucide-react';

interface PottyBreakGroupSelectorProps {
  dogs: DogCareStatus[];
  onGroupSelected: (dogIds: string[]) => void;
}

const PottyBreakGroupSelector: React.FC<PottyBreakGroupSelectorProps> = ({ 
  dogs, 
  onGroupSelected 
}) => {
  const [groups, setGroups] = useState<DogGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupMembers, setGroupMembers] = useState<{[key: string]: string[]}>({});
  
  // Fetch dog groups
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setIsLoading(true);
        const dogGroups = await fetchDogGroups();
        setGroups(dogGroups);
        
        // For each group, fetch the members
        const membersPromises = dogGroups.map(async (group) => {
          const members = await fetchGroupMembers(group.id);
          return { 
            groupId: group.id, 
            memberIds: members.map(m => m.dog_id) 
          };
        });
        
        // Wait for all member fetches to complete
        const results = await Promise.all(membersPromises);
        
        // Convert to map of groupId -> member ids
        const membersMap: {[key: string]: string[]} = {};
        results.forEach(result => {
          membersMap[result.groupId] = result.memberIds;
        });
        
        setGroupMembers(membersMap);
      } catch (error) {
        console.error('Error loading dog groups:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGroups();
  }, []);

  // Get valid dog ids (those that exist in the current dogs array)
  const getValidDogIds = (groupId: string): string[] => {
    if (!groupMembers[groupId]) return [];
    
    // Filter to only include dogs that exist in the current dogs array
    const existingDogIds = dogs.map(d => d.dog_id);
    return groupMembers[groupId].filter(id => existingDogIds.includes(id));
  };

  // Get background color based on group color
  const getGroupColor = (color: string | null): string => {
    switch (color) {
      case 'blue': return 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300';
      case 'teal': return 'bg-teal-100 hover:bg-teal-200 text-teal-800 border-teal-300';
      case 'yellow': return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300';
      case 'red': return 'bg-red-100 hover:bg-red-200 text-red-800 border-red-300';
      case 'green': return 'bg-green-100 hover:bg-green-200 text-green-800 border-green-300';
      case 'purple': return 'bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading dog groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Dog Groups Found</h3>
            <p className="text-muted-foreground mb-4">
              You need to set up dog groups first to use the group potty break feature.
            </p>
            <Button 
              onClick={() => {
                // Navigate to the groups tab
                const groupsTab = document.querySelector('[value="groups"]');
                if (groupsTab) {
                  (groupsTab as HTMLElement).click();
                }
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              Set Up Dog Groups
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => {
            const validDogIds = getValidDogIds(group.id);
            const dogCount = validDogIds.length;
            
            // Get dog names for the display
            const groupDogNames = dogs
              .filter(d => validDogIds.includes(d.dog_id))
              .map(d => d.dog_name);
              
            return (
              <Card 
                key={group.id}
                className={`overflow-hidden cursor-pointer transition-all ${getGroupColor(group.color)}`}
                onClick={() => onGroupSelected(validDogIds)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <Users className="h-5 w-5 mr-2" />
                      <h3 className="font-medium text-lg">{group.name}</h3>
                    </div>
                    
                    <div className="text-sm mb-2">
                      <span className="font-medium">{dogCount} dogs</span> in this group
                    </div>
                    
                    {dogCount > 0 ? (
                      <div className="text-sm line-clamp-2">
                        {groupDogNames.sort().join(', ')}
                      </div>
                    ) : (
                      <div className="text-sm italic text-muted-foreground">
                        No dogs in this group
                      </div>
                    )}
                    
                    <div className="mt-auto pt-3">
                      <Button 
                        className="w-full"
                        variant="secondary"
                        disabled={dogCount === 0}
                      >
                        Select Group
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PottyBreakGroupSelector;
