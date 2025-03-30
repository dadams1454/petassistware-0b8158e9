
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';
import { AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { checkDogsIncompatibility } from '@/services/dailyCare/dogIncompatibilitiesService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchDogGroups, fetchGroupMembers } from '@/services/dailyCare/dogGroupsService';

interface PottyBreakDogSelectionProps {
  dogs: DogCareStatus[];
  selectedDogs: string[];
  onChange: (selectedDogs: string[]) => void;
}

interface DogGroupType {
  id: string;
  name: string;
  color: string | null;
}

const PottyBreakDogSelection: React.FC<PottyBreakDogSelectionProps> = ({ 
  dogs, 
  selectedDogs, 
  onChange 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [incompatibilities, setIncompatibilities] = useState<{[key: string]: string[]}>({});
  const [groups, setGroups] = useState<DogGroupType[]>([]);
  const [activeTab, setActiveTab] = useState('allDogs');
  const [loadingGroupMembers, setLoadingGroupMembers] = useState(false);
  const [groupMembers, setGroupMembers] = useState<{[key: string]: string[]}>({});

  // Fetch dog groups
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const dogGroups = await fetchDogGroups();
        setGroups(dogGroups);
      } catch (error) {
        console.error('Error loading dog groups:', error);
      }
    };
    
    loadGroups();
  }, []);

  // Fetch group members when tab changes
  useEffect(() => {
    if (activeTab !== 'allDogs' && !groupMembers[activeTab]) {
      const loadGroupMembers = async () => {
        setLoadingGroupMembers(true);
        try {
          const members = await fetchGroupMembers(activeTab);
          setGroupMembers(prev => ({
            ...prev,
            [activeTab]: members.map(m => m.dog_id)
          }));
        } catch (error) {
          console.error('Error loading group members:', error);
        } finally {
          setLoadingGroupMembers(false);
        }
      };
      
      loadGroupMembers();
    }
  }, [activeTab, groupMembers]);

  // Check incompatibilities when dogs are selected
  useEffect(() => {
    const checkIncompatibilities = async () => {
      if (selectedDogs.length <= 1) {
        setIncompatibilities({});
        return;
      }

      const newIncompatibilities: {[key: string]: string[]} = {};

      // Check each selected dog against every other selected dog
      for (let i = 0; i < selectedDogs.length; i++) {
        const dogId1 = selectedDogs[i];
        
        for (let j = i + 1; j < selectedDogs.length; j++) {
          const dogId2 = selectedDogs[j];
          
          try {
            const areIncompatible = await checkDogsIncompatibility(dogId1, dogId2);
            
            if (areIncompatible) {
              if (!newIncompatibilities[dogId1]) {
                newIncompatibilities[dogId1] = [];
              }
              if (!newIncompatibilities[dogId2]) {
                newIncompatibilities[dogId2] = [];
              }
              
              newIncompatibilities[dogId1].push(dogId2);
              newIncompatibilities[dogId2].push(dogId1);
            }
          } catch (error) {
            console.error('Error checking incompatibility:', error);
          }
        }
      }

      setIncompatibilities(newIncompatibilities);
    };

    checkIncompatibilities();
  }, [selectedDogs]);

  // Filter dogs based on search query
  const filteredDogs = dogs.filter(dog => 
    dog.dog_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter dogs based on active tab (group)
  const getVisibleDogs = () => {
    if (activeTab === 'allDogs') {
      return filteredDogs;
    }
    
    // Filter by group members
    if (groupMembers[activeTab]) {
      return filteredDogs.filter(dog => 
        groupMembers[activeTab].includes(dog.dog_id)
      );
    }
    
    return [];
  };

  // Handle select all or none for current filtered view
  const handleSelectAll = () => {
    const visibleDogIds = getVisibleDogs().map(d => d.dog_id);
    const allSelected = visibleDogIds.every(id => selectedDogs.includes(id));
    
    if (allSelected) {
      // Deselect all visible dogs
      onChange(selectedDogs.filter(id => !visibleDogIds.includes(id)));
    } else {
      // Select all visible dogs
      const newSelection = [...new Set([...selectedDogs, ...visibleDogIds])];
      onChange(newSelection);
    }
  };

  // Get dog name by id for incompatibility display
  const getDogNameById = (id: string): string => {
    const dog = dogs.find(d => d.dog_id === id);
    return dog ? dog.dog_name : 'Unknown Dog';
  };

  // Check if a dog has incompatibility issues with selected dogs
  const hasIncompatibility = (dogId: string): boolean => {
    return !!incompatibilities[dogId];
  };

  // Get color for dog group tab
  const getGroupColor = (color: string | null): string => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'teal': return 'bg-teal-100 text-teal-800 hover:bg-teal-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'red': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'green': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'purple': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Get special flag labels for a dog
  const getDogFlags = (dog: DogCareStatus) => {
    return (
      <div className="flex flex-wrap gap-1 ml-2">
        {dog.flags.map(flag => {
          const flagColors = getFlagColors(flag);
          return (
            <Badge key={flag.type} className={`${flagColors} font-normal text-xs`}>
              {getFlagName(flag)}
            </Badge>
          );
        })}
      </div>
    );
  };

  // Get background color based on flag type
  const getFlagColors = (flag: DogFlag): string => {
    switch (flag.type) {
      case 'in_heat':
        return 'bg-pink-100 text-pink-800 hover:bg-pink-200';
      case 'pregnant':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'special_attention':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'incompatible':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'other':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Get human-readable flag name
  const getFlagName = (flag: DogFlag): string => {
    switch (flag.type) {
      case 'in_heat':
        return 'In Heat';
      case 'pregnant':
        return 'Pregnant';
      case 'special_attention':
        return flag.value || 'Special Attention';
      case 'incompatible':
        return 'Incompatible';
      case 'other':
        return flag.value || 'Other';
      default:
        return flag.type;
    }
  };

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="mb-2 flex flex-wrap h-auto">
          <TabsTrigger value="allDogs">All Dogs</TabsTrigger>
          {groups.map(group => (
            <TabsTrigger
              key={group.id}
              value={group.id}
              className={getGroupColor(group.color)}
            >
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Control buttons */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {selectedDogs.length} dogs selected
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
            >
              {getVisibleDogs().every(d => selectedDogs.includes(d.dog_id)) 
                ? 'Deselect All' 
                : 'Select All'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onChange([])}
              disabled={selectedDogs.length === 0}
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Incompatibility warning */}
        {Object.keys(incompatibilities).length > 0 && (
          <Card className="bg-amber-50 border-amber-300 mb-4">
            <CardContent className="p-3">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Incompatible Dogs Selected</h4>
                  <p className="text-sm text-amber-700">
                    Some selected dogs should not be together. Please review your selection.
                  </p>
                  <ul className="mt-2 text-sm text-amber-700 space-y-1">
                    {Object.entries(incompatibilities).map(([dogId, incompatibleIds]) => (
                      <li key={dogId}>
                        <strong>{getDogNameById(dogId)}</strong> is incompatible with{' '}
                        {incompatibleIds.map(id => getDogNameById(id)).join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dog selection grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-1">
          {getVisibleDogs().map(dog => {
            const isSelected = selectedDogs.includes(dog.dog_id);
            const hasConflict = hasIncompatibility(dog.dog_id);
            
            return (
              <div 
                key={dog.dog_id}
                className={`
                  flex items-center space-x-2 p-2 rounded-md border
                  ${isSelected ? 'bg-primary-50 border-primary-200' : 'bg-card border-muted'}
                  ${hasConflict ? 'border-amber-400' : ''}
                  hover:bg-accent transition-colors
                `}
              >
                <Checkbox
                  id={`dog-${dog.dog_id}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedDogs, dog.dog_id]);
                    } else {
                      onChange(selectedDogs.filter(id => id !== dog.dog_id));
                    }
                  }}
                />
                <div className="flex items-center flex-grow">
                  <label 
                    htmlFor={`dog-${dog.dog_id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center"
                  >
                    {dog.dog_photo ? (
                      <img 
                        src={dog.dog_photo} 
                        alt={dog.dog_name} 
                        className="h-8 w-8 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center mr-2">
                        <span className="text-xs font-medium">{dog.dog_name.charAt(0)}</span>
                      </div>
                    )}
                    <span>{dog.dog_name}</span>
                  </label>
                  
                  {dog.flags.length > 0 && getDogFlags(dog)}
                </div>
                
                {hasConflict && (
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                )}
              </div>
            );
          })}
          
          {getVisibleDogs().length === 0 && (
            <div className="col-span-2 p-8 text-center text-muted-foreground">
              {loadingGroupMembers 
                ? 'Loading dogs...' 
                : searchQuery
                  ? 'No dogs found matching your search'
                  : 'No dogs in this group'}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default PottyBreakDogSelection;
